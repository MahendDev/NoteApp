import { registerPlugin } from '@capacitor/core';
import type { PinShortcutPlugin } from './pinShortcut';

const PinShortcut = registerPlugin<PinShortcutPlugin>('PinShortcut', {
    web: {
        pinNote: async () => {
            console.warn('Pin shortcut not supported on web');
            return { success: false };
        },
    },
});

export default PinShortcut;
export * from './pinShortcut';
