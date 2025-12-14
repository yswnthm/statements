# Project Requirements: Statements

## Overview
**Statements** is a private micro-blogging application designed for personal use ("the network is you"). It functions as a feed of "statements" (posts) categorized by three distinct timelines representing the user's self.

## Core Concepts

### Timelines
The feed is personalized and segmented into three timelines:
1.  **Past Self**: Reflecting on actions completed.
2.  **Current Self**: documenting what is happening now.
3.  **Future Self**: Planning or aspiring towards future actions.

### Statements
A "Statement" is the fundamental unit of content (similar to a tweet or post).
-   **Purpose**: Represents an action that is either:
    -   Done.
    -   Yet to be done.
    -   Desired to be done.
-   **Example**: "I wanna run 3km everyday for this week."

## Execution Strategy (Tiers)

We will build the application in four distinct tiers, evolving from a simple utility to the full "Statements" vision.

### Tier 1: Natural Language Todo List (MVP)
*   **Goal**: Quick capture of thoughts/actions.
*   **Features**:
    *   Simple text input for "Statements".
    *   List view of entered items.
    *   Basic persistence (local or database).
    *   *No complex parsing or distinct timelines yet.*

### Tier 2: Structured Logic (Goals, Tasks, Reminders)
*   **Goal**: Add meaning and structure to the statements.
*   **Features**:
    *   **Agentic Processing**: Parse the natural language statements to identify:
        *   **Goals**: Long-term objectives (e.g., "Run 3km everyday").
        *   **Tasks**: Actionable items (e.g., "Buy running shoes").
        *   **Reminders**: Time-based alerts.
    *   **Interface**: Dedicated UI views for managing these extracted entities.

### Tier 3: Integrations
*   **Goal**: Connect with external personal management tools.
*   **Features**:
    *   **Google Calendar**: Sync events and time-blocks suitable for the identified tasks.
    *   **Google Tasks/Reminders**: Sync actionable items.

### Tier 4: The "Statements" Feed (The Core Vision)
*   **Goal**: The full "Network of You" experience.
*   **Features**:
    *   **Three Timelines Feed**:
        1.  **Past Self**: History of what was done.
        2.  **Current Self**: Live feed of current focus/status.
        3.  **Future Self**: Queue of aspirations and planned actions.
    *   **Micro-blogging Interface**: Creating statements feels like posting to a social feed.
