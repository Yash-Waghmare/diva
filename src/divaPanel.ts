import * as vscode from 'vscode';

export class DivaPanelProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'diva.room';

    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = {
            enableScripts: true,
        };
        webviewView.webview.html = this.getHtml();
}

private getHtml(): string {
    return /* html */ `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<style>
					body {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						height: 100vh;
						margin: 0;
						font-family: sans-serif;
						color: var(--vscode-foreground);
					}
					.diva { font-size: 64px; }
					p { opacity: 0.8; }
				</style>
			</head>
			<body>
				<div class="diva">👧</div>
				<p>Hi, I'm Diva.</p>
			</body>
			</html>`;
    }
}