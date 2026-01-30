package com.noteapp.app;

import android.content.Intent;
import android.content.pm.ShortcutInfo;
import android.content.pm.ShortcutManager;
import android.graphics.drawable.Icon;
import android.os.Build;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "PinShortcut")
public class PinShortcutPlugin extends Plugin {

    @PluginMethod
    public void pinNote(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            call.reject("Shortcuts not supported on this Android version");
            return;
        }

        String noteId = call.getString("noteId");
        String noteTitle = call.getString("noteTitle");

        if (noteId == null || noteTitle == null) {
            call.reject("Note ID and title are required");
            return;
        }

        ShortcutManager shortcutManager = getContext().getSystemService(ShortcutManager.class);
        
        if (shortcutManager == null || !shortcutManager.isRequestPinShortcutSupported()) {
            call.reject("Pinned shortcuts not supported on this device");
            return;
        }

        Intent intent = new Intent(getContext(), MainActivity.class);
        intent.setAction(Intent.ACTION_VIEW);
        intent.putExtra("noteId", noteId);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);

        ShortcutInfo shortcut = new ShortcutInfo.Builder(getContext(), "note_" + noteId)
                .setShortLabel(noteTitle)
                .setLongLabel(noteTitle)
                .setIcon(Icon.createWithResource(getContext(), R.mipmap.ic_launcher))
                .setIntent(intent)
                .build();

        try {
            shortcutManager.requestPinShortcut(shortcut, null);
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to create shortcut: " + e.getMessage());
        }
    }
}
