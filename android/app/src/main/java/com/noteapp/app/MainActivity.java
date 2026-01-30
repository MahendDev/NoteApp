package com.noteapp.app;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register plugin before super.onCreate()
        registerPlugin(PinShortcutPlugin.class);
        super.onCreate(savedInstanceState);
        handleShortcutIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleShortcutIntent(intent);
    }

    private void handleShortcutIntent(Intent intent) {
        if (intent != null && intent.hasExtra("noteId")) {
            String noteId = intent.getStringExtra("noteId");
            if (noteId != null && getBridge() != null) {
                // Trigger event to web layer
                getBridge().triggerWindowJSEvent("noteShortcutOpened", "{\"noteId\":\"" + noteId + "\"}");
            }
        }
    }
}
