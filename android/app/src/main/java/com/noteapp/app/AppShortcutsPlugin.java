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

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "AppShortcuts")
public class AppShortcutsPlugin extends Plugin {

    @PluginMethod
    public void setShortcuts(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N_MR1) {
            call.reject("App shortcuts not supported on this Android version");
            return;
        }

        try {
            JSONArray notesArray = call.getArray("notes");
            if (notesArray == null) {
                call.reject("Notes array is required");
                return;
            }

            ShortcutManager shortcutManager = getContext().getSystemService(ShortcutManager.class);
            if (shortcutManager == null) {
                call.reject("ShortcutManager not available");
                return;
            }

            List<ShortcutInfo> shortcuts = new ArrayList<>();
            int maxShortcuts = Math.min(notesArray.length(), shortcutManager.getMaxShortcutCountPerActivity());

            for (int i = 0; i < maxShortcuts; i++) {
                JSONObject noteObj = notesArray.getJSONObject(i);
                String noteId = noteObj.getString("id");
                String noteTitle = noteObj.getString("title");
                
                // Limit title length for better display
                if (noteTitle.length() > 25) {
                    noteTitle = noteTitle.substring(0, 22) + "...";
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

                shortcuts.add(shortcut);
            }

            shortcutManager.setDynamicShortcuts(shortcuts);
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("count", shortcuts.size());
            call.resolve(ret);
            
        } catch (Exception e) {
            call.reject("Failed to set shortcuts: " + e.getMessage());
        }
    }
}
