package com.noteapp.app;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(PinShortcutPlugin.class);
        handleIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIntent(intent);
    }

    private void handleIntent(Intent intent) {
        if (intent != null && intent.hasExtra("noteId")) {
            String noteId = intent.getStringExtra("noteId");
            // Send noteId to the web app via JavaScript bridge
            this.getBridge().triggerJSEvent("noteShortcutOpened", "{\"noteId\":\"" + noteId + "\"}");
        }
    }
}
