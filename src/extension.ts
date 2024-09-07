import * as vscode from 'vscode';

let lastSpacePressTime = 0; // Track the timestamp of the last space key press
let singleTapTimeout: NodeJS.Timeout | undefined; // Timeout for handling single tap

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'extension.moveCursorToEndOfWord',
    () => {
      const now = Date.now(); // Get the current time in milliseconds
      const timeSinceLastPress = now - lastSpacePressTime; // Time since last space press

      // Update the last press time immediately
      lastSpacePressTime = now;

      if (timeSinceLastPress < 300) { // Double-tap detected
        if (singleTapTimeout) {
          clearTimeout(singleTapTimeout); // Clear the pending single-tap action
          singleTapTimeout = undefined; // Reset the timeout
        }

        // Handle double-tap: move cursor to the end of the current word
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          const document = editor.document;
          editor.selections = editor.selections.map((selection) => {
            const position = selection.active;
            const lineText = document.lineAt(position.line).text;
            const newPosition = position.with(position.line, lineText.length);
            return new vscode.Selection(newPosition, newPosition);
          });
        }
      } else {
        // Handle single-tap: set a timeout to insert a space
        singleTapTimeout = setTimeout(() => {
          vscode.commands.executeCommand('default:type', { text: ' ' }); // Insert space after confirming it's a single tap
          singleTapTimeout = undefined; // Clear the timeout reference
        }, 300); // 300 ms wait for confirming a single tap
      }
    }
  );

  context.subscriptions.push(disposable);
}
