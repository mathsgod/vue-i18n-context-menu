// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "vue-i18n-context-menu" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	/* 	let disposable = vscode.commands.registerCommand('vue-i18n-context-menu.helloWorld', () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			vscode.window.showInformationMessage('Hello World from vue-i18n-context-menu!');
		});
	
		context.subscriptions.push(disposable); */
	const store_texts = new Map();

	const find_available_keys = (text: string) => {
		let key = text;
		while (store_texts.has(key)) {
			key = key + "-1";
		}
		return key;
	};


	const filter_text = (text: string) => {
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
		return newText;
	};

	let command2 = vscode.commands.registerTextEditorCommand("vue-i18n-context-menu.t", (editor, edit) => {

		const selection = editor.selection;
		if (selection.isEmpty) {
			vscode.window.showInformationMessage("Please select text to translate");
			return;
		}

		const text = editor.document.getText(selection);

		let newText = filter_text(text);
		store_texts.set(newText, newText);

		newText = `{{$t('${newText}')}}`;
		edit.replace(selection, newText);
	});
	context.subscriptions.push(command2);

	let t_with_input = vscode.commands.registerTextEditorCommand("vue-i18n-context-menu.t_with_input", (editor, edit) => {

		const selection = editor.selection;
		if (selection.isEmpty) {
			vscode.window.showInformationMessage("Please select text to translate");
			return;
		}

		const text = editor.document.getText(selection);

		//ask for name
		vscode.window.showInputBox({ prompt: "Please input the name of the text" }).then((name) => {

			if (name) {

				let key = find_available_keys(name);

				//store the text
				store_texts.set(key, text);

				let newText = `{{$t('${key}')}}`;

				editor.edit((editBuilder) => {
					editBuilder.replace(selection, newText);
				});

			}
		});
	});

	context.subscriptions.push(t_with_input);

	let command_paste = vscode.commands.registerTextEditorCommand("vue-i18n-context-menu.paste", (editor, edit) => {
		//paste stored text to editor

		//create a key for each text
		let data: any = {};
		store_texts.forEach((value, key) => {
			data[key] = value;
		});

		//convert to json
		let json = JSON.stringify(data, null, 4);

		//remove first and last
		json = json.substring(1, json.length - 1);

		edit.replace(editor.selection, json);

		//clear store_texts
		store_texts.clear();
	});
	context.subscriptions.push(command_paste);

}

// This method is called when your extension is deactivated
export function deactivate() { }
