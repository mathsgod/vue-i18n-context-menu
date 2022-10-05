// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "vue-i18-context-menu" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	/* 	let disposable = vscode.commands.registerCommand('vue-i18-context-menu.helloWorld', () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			vscode.window.showInformationMessage('Hello World from vue-i18-context-menu!');
		});
	
		context.subscriptions.push(disposable); */


	let command2 = vscode.commands.registerTextEditorCommand("vue-i18-context-menu.t", (editor, edit) => {
		const selection = editor.selection;
		const text = editor.document.getText(selection);

		//if new text has "'", replace it with "\'"
		let newText = text.replace(/'/g, "\\'");

		//remove all enter
		newText = newText.replace(/\n/g, "");
		//remove all \r
		newText = newText.replace(/\r/g, "");

		//remove consecutive spaces
		newText = newText.replace(/\s+/g, " ");
		//trim
		newText = newText.trim();
		newText = `$t('${newText}')`;
		edit.replace(selection, newText);
	});

	context.subscriptions.push(command2);

}

// This method is called when your extension is deactivated
export function deactivate() { }
