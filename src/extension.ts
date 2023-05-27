import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.collapseAllFuncs', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const methodRanges = getMethodRanges(document);
			if (methodRanges) {
				collapseRanges(editor, methodRanges);
			}
		}
	});

	context.subscriptions.push(disposable);
}

function getMethodRanges(document: vscode.TextDocument): vscode.Range[] | undefined {
	const methodRanges: vscode.Range[] = [];
	let isInMethod = false;
	let openParenthesisCount = 0;
	let openBracketsCount = 0;

	for (let line = 0; line < document.lineCount; line++) {
		const textLine = document.lineAt(line);
		const lineText = textLine.text.trim();

		if (!isInMethod && lineText.startsWith('func ')) {
			isInMethod = true;
			openParenthesisCount += countCharOccurrences(lineText, '(');
			openBracketsCount += countCharOccurrences(lineText, '{');

			if (openParenthesisCount > 0 && openParenthesisCount === countCharOccurrences(lineText, ')')) {
				methodRanges.push(textLine.range);
			}
		} else if (isInMethod) {
			methodRanges.push(textLine.range);
			openParenthesisCount += countCharOccurrences(lineText, '(');
			openParenthesisCount -= countCharOccurrences(lineText, ')');
			openBracketsCount += countCharOccurrences(lineText, '{');
			openBracketsCount -= countCharOccurrences(lineText, '}');

			if (openParenthesisCount === 0 && openBracketsCount === 0) {
				isInMethod = false;
			}
		}
	}

	return methodRanges.length > 0 ? methodRanges : undefined;
}

function countCharOccurrences(text: string, char: string): number {
	return text.split(char).length - 1;
}

function collapseRanges(editor: vscode.TextEditor, ranges: vscode.Range[]) {
	editor.selections = ranges.map(range => new vscode.Selection(range.start, range.start));
	vscode.commands.executeCommand('editor.fold');
	const firstRange = ranges[0];
	const startPosition = new vscode.Position(firstRange.start.line, 0);
	editor.selection = new vscode.Selection(startPosition, startPosition);
}


function collapseRangesOld(editor: vscode.TextEditor, ranges: vscode.Range[]) {
	editor.selections = ranges.map(range => new vscode.Selection(range.start, range.start));
	vscode.commands.executeCommand('editor.fold');
}

export function deactivate() { }
