export interface AppShortcutsPlugin {
    setShortcuts(options: { notes: Array<{ id: string; title: string }> }): Promise<{ success: boolean; count: number }>;
}
