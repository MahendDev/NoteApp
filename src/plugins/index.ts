import { registerPlugin } from '@capacitor/core';
import type { AppShortcutsPlugin } from './appShortcuts';

const AppShortcuts = registerPlugin<AppShortcutsPlugin>('AppShortcuts', {
    web: {
        setShortcuts: async () => {
            console.warn('App shortcuts not supported on web');
            return { success: false, count: 0 };
        },
    },
});

export default AppShortcuts;
export * from './appShortcuts';
