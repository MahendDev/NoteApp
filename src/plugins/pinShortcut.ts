export interface PinShortcutPlugin {
    pinNote(options: { noteId: string; noteTitle: string }): Promise<{ success: boolean }>;
}
