"use server";

import { generateObject, experimental_transcribe as transcribe } from "ai";
import { statements } from "@/lib/models";
import { z } from "zod";
import { elevenlabs } from '@ai-sdk/elevenlabs';
import { DetermineActionFn } from "@/types/actions";

export const determineAction: DetermineActionFn = async (text, emoji, todos, model = "statements-default", timezone = "UTC") => {
    console.log("Determining action...");
    console.log(text, emoji, todos);
    console.log("Model:", model);
    console.log("Timezone:", timezone);

    // Create dates in the user's timezone using a more reliable method
    function getDateInTimezone(timezone: string) {
        // Get current date/time string in the user's timezone
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        // Format date in timezone
        const dateTimeString = new Intl.DateTimeFormat('en-US', options).format(now);

        // Parse components from formatted string (formats like "04/10/2024, 00:30:00")
        const [datePart] = dateTimeString.split(', ');
        const [month, day, year] = datePart.split('/').map(num => parseInt(num, 10));

        // Create a date string in YYYY-MM-DD format
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    // Get today and tomorrow in timezone
    const todayStr = getDateInTimezone(timezone);

    // For tomorrow, we need to add one day
    const todayDate = new Date(todayStr);
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

    console.log("Today in timezone:", todayStr);
    console.log("Tomorrow in timezone:", tomorrowStr);

    const prompt = `
        Today's date is: ${todayStr} (Timezone: ${timezone})
        The user has entered the following text: ${text}
        ${emoji ? `The user has also entered the following emoji: ${emoji}` : ""}
        
        You are the AI for "Statements", a personal micro-blogging application where "the network is you".
        Your goal is to organize the user's thoughts into a structured feed of "Statements".
        
        ## Core Concepts
        
        ### 1. Timelines (The "When")
        Classify the statement into one of three timelines:
        - **Past Self** ("past"): Actions completed, history, reflection. (e.g., "I ran 5km", "I read a book").
        - **Current Self** ("current"): What is happening now, current focus. (e.g., "Reading a book", "Working on project").
        - **Future Self** ("future"): Aspirations, planned actions, queue. (e.g., "I want to run", "Buy milk", "Remind me").
        
        ### 2. Categories (The "What")
        Classify the statement into one of these categories:
        - **Goal** ("goal"): Long-term objectives, aspirations, desires. (e.g., "Run 3km everyday", "Read 12 books this year"). usually associated with "want to", "aiming to".
        - **Task** ("task"): Actionable items, to-dos. (e.g., "Buy running shoes", "Call Mom").
        - **Reminder** ("reminder"): Time-sensitive alerts. (e.g., "Remind me to call at 5pm").
        - **Statement** ("statement"): General thoughts, observations, or updates that don't fit strictly into the above (default for generic posts).

        ## Date & Time Parsing
        The user can specify dates and times naturally.
        - "add buy groceries today" -> targetDate: ${todayStr}
        - "add buy groceries tomorrow" -> targetDate: ${tomorrowStr}
        - "meeting at 3pm tomorrow" -> time: "15:00", targetDate: ${tomorrowStr}
        
        Extract the date (YYYY-MM-DD) and time (HH:mm, 24-hour).
        If no date is specified:
        - For "future" timeline items (tasks/reminders), default to today (${todayStr}) unless "someday" is implied.
        - For "past" items, default to today if it just happened, or infer from context (e.g., "yesterday").
        
        ## Logic
        - **Analyze the User's Intent**:
            - "I want to start running" -> Action: "add", Text: "Start running", Timeline: "future", Category: "goal"
            - "Buy milk" -> Action: "add", Text: "Buy milk", Timeline: "future", Category: "task"
            - "I ran 5km" -> Action: "add", Text: "Ran 5km", Timeline: "past", Category: "statement" (or task if tracking completion)
        - **Existing Todos**:
            - You have access to the current list.
            - If the user says "I bought milk" and "Buy milk" is in the list -> Action: "mark", Status: "complete", TodoId: <id>.
            - If not in list, maybe they just want to log it -> Action: "add", Timeline: "past".
        
        ## Humor & Personality
        - Be helpful but recognize the user's tone.
        - Prioritize the user's specific emoji if provided.
        
        ${todos ? `<todo_list>
        ${todos?.map(todo => `- ${todo.id}: ${todo.text} (${todo.emoji})`).join("\n")}
        </todo_list>` : ""}

        ## Quantitative Updates
        - **Tracking Progress**:
            - If the user reports partial progress on a task (e.g., "I drank 2L of water") and a corresponding task exists (e.g., "Drink 4L of water") or the user says "add I drank 2L of water":
            - **Do NOT** mark the original task as complete effectively unless the goal is fully reached.
            - **Edit** the existing task to reflect the remaining amount.
            - Example: 
                - Existing Task: "Drink 4L of water"
                - User Input: "I drank 2L of water"
                - Analysis: 4L (Goal) - 2L (Progress) = 2L (Remaining)
                - Action: "edit", TodoId: <id>, Text: "Drink 2L of water left" (or keep original text if tracking generally, but user asked to update).
                - BETTER APPROACH: If the user says "I drank 2L", JUST EDIT the future goal. Do not create a separate log entry unless explicitly asked.
                - If the user explicitly asks to update: "update task", prioritize the edit.
                - If the user just says "Drank 2L", assume they want to update the goal.
                - Action: "edit", TodoId: <matching_id>, Text: "Drink 2L of water" (calculated remaining).

        ## strict rules
        - **Always** return an array of actions.
        - **Actions**: ${["add", "delete", "mark", "sort", "edit", "clear"].join(", ")}
        - **Format**: Lowercase text for the todo content.
    `;

    console.log("prompt", prompt);
    const startTime = Date.now();
    const { object: action, usage } = await generateObject({
        model: statements.languageModel(model),
        temperature: 0,
        providerOptions: {
            groq: {
                "service_tier": "auto",
            }
        },
        schema: z.object({
            actions: z.array(z.object({
                action: z.enum(["add", "delete", "mark", "sort", "edit", "clear",]).describe("The action to take"),
                text: z.string().describe("The text of the todo item.").optional(),
                todoId: z.string().describe("The id of the todo item to act upon").optional(),
                emoji: z.string().describe("The emoji of the todo item").optional(),
                targetDate: z.string().describe("The target date for the todo item in YYYY-MM-DD format").optional(),
                time: z.string().describe("The time for the todo item in HH:mm format (24-hour)").optional(),
                category: z.enum(["goal", "task", "reminder", "statement"]).describe("The category of the statement").optional(),
                timeline: z.enum(["past", "current", "future"]).describe("The timeline the statement belongs to").optional(),
                sortBy: z.enum(
                    ["newest", "oldest", "alphabetical", "completed"]
                ).describe("The sort order").optional(),
                status: z.enum(["complete", "incomplete"]).describe("The status of the todo item. to be used for the mark action").optional(),
                listToClear: z.enum(["all", "completed", "incomplete"]).describe("The list to clear").optional(),
            })),
        }),
        prompt,
    });
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`Time taken: ${duration}ms`);
    console.log(action);
    console.log("usage", usage);
    return action;
}

export async function convertSpeechToText(audioFile: any) {
    "use server";

    if (!audioFile) {
        throw new Error("No audio file provided");
    }

    console.log("Processing audio file:", {
        type: audioFile.type,
        size: audioFile.size,
        name: audioFile.name || "unnamed"
    });

    const { text } = await transcribe({
        model: elevenlabs.transcription("scribe_v1"),
        audio: await audioFile.arrayBuffer(),
    });

    console.log("Transcribed text:", text);
    return text;
}
