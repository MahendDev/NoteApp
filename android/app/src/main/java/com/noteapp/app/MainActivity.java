package com.noteapp.app;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register plugin before super.onCreate()
        registerPlugin(AppShortcutsPlugin.class);
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
            if (noteId != null) {
                // Try to trigger immediately or retry if bridge/webview not ready
                new android.os.Handler().postDelayed(() -> {
                    if (getBridge() != null && getBridge().getWebView() != null) {
                         getBridge().triggerWindowJSEvent("noteShortcutOpened", "{\"noteId\":\"" + noteId + "\"}");
                    }
                }, 1500); // 1.5s delay to allow React to load
            }
        }
    }
}
