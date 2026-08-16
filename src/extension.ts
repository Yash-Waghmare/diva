import * as vscode from 'vscode';
import { DivaPanelProvider } from './divaPanel';
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "diva" is now active!');

	const disposable = vscode.commands.registerCommand('diva.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from diva!');
	});

	const divaPanel = new DivaPanelProvider();
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			DivaPanelProvider.viewType,
			divaPanel
		)
	)

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
