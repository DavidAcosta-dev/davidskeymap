import * as vscode from 'vscode';

let lastSpacePressTime = 0; // Timestamp of the last space key press
let singleTapTimeout: NodeJS.Timeout | undefined; // Timeout identifier

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'extension.moveCursorToEndOfWord',
    () => {
      const now = Date.now(); // Get the current time in milliseconds
      const timeSinceLastPress = now - lastSpacePressTime; // Calculate the time since the last space press

      if (timeSinceLastPress < 300) {
        // Double-tap detected within 300 ms
        if (singleTapTimeout) {
          clearTimeout(singleTapTimeout); // Clear the single-tap timeout to prevent inserting a space
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
        // Handle single-tap with a delay, allowing time to check for a potential double-tap
        singleTapTimeout = setTimeout(() => {
          vscode.commands.executeCommand('default:type', { text: ' ' }); // Insert space after timeout
        }, 300); // Wait for 300 ms before confirming it's a single tap
      }

      // Update the last space press time
      lastSpacePressTime = now;
    }
  );

  context.subscriptions.push(disposable);
}


  
  // import * as vscode from 'vscode';
  
  // let lastSpacePress = 0;
  
  // export function activate(context: vscode.ExtensionContext) {
  //   let disposable = vscode.commands.registerCommand('extension.moveCursorToEndOfWord', () => {
  //     const editor = vscode.window.activeTextEditor;
  //     if (editor) {
  //       const now = Date.now();
  //       if (now - lastSpacePress < 300) {
  //         const position = editor.selection.active;
  //         const wordRange = editor.document.getWordRangeAtPosition(position);
  //         if (wordRange) {
  //           const endPosition = wordRange.end;
  //           editor.selection = new vscode.Selection(endPosition, endPosition);
  //         }
  //       } else {
  //         vscode.commands.executeCommand('default:type', { text: ' ' });
  
  //       }
  //       lastSpacePress = now;
  //     }
  //   });
  
  //   context.subscriptions.push(disposable);
  // }
  
  // export function deactivate() {}


// import * as vscode from 'vscode';

// let lastSpacePress = 0;

// export function activate(context: vscode.ExtensionContext) {
//   let disposable = vscode.commands.registerCommand('extension.moveCursorToEndOfWord', () => {
//     const editor = vscode.window.activeTextEditor;
//     if (editor) {
//       const now = Date.now();
//       if (now - lastSpacePress < 300) {
//         const position = editor.selection.active;
//         const wordRange = editor.document.getWordRangeAtPosition(position);
//         if (wordRange) {
//           const endPosition = wordRange.end;
//           editor.selection = new vscode.Selection(endPosition, endPosition);
//         }
//       } else {
//         vscode.commands.executeCommand('default:type', { text: ' ' });

//       }
//       lastSpacePress = now;
//     }
//   });

//   context.subscriptions.push(disposable);
// }

// export function deactivate() {}





