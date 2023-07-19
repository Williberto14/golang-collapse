import { commands, window, TextEditor, Range, Position, ExtensionContext, TextDocument, TextEditorRevealType, Selection } from 'vscode';

export function activate(context: ExtensionContext) {
	let collapseAllFuncsCommand = commands.registerCommand('extension.collapseAllFuncs', () => {
		const editor = window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const methodRanges = getMethodRanges(document);
			if (methodRanges) {
				const currentPosition = editor.selection.active;
				collapseRanges(editor, methodRanges);
				editor.revealRange(new Range(currentPosition, currentPosition), TextEditorRevealType.InCenter);
			}
		}
	});

	let expandAllFuncsCommand = commands.registerCommand('extension.expandAllFuncs', () => {
		const editor = window.activeTextEditor;
		if (editor) {
			commands.executeCommand('editor.unfoldAll');
		}
	});

	context.subscriptions.push(collapseAllFuncsCommand, expandAllFuncsCommand);
}

function collapseRanges(editor: TextEditor, ranges: Range[]) {
	editor.selections = ranges.map(range => new Selection(range.start, range.start));
	commands.executeCommand('editor.fold');
	const firstRange = ranges[0];
	const startPosition = new Position(firstRange.start.line, 0);
	editor.selection = new Selection(startPosition, startPosition);
}

// method to get the ranges of the methods and functions of a go file
// get the range of each function and store it in an array
// the array is returned with the ranges of the functions
// if no function is found, undefined is returned.
// must work for methods and functions with or without parameters and with or without braces on the same line 
// it must not collapse code blocks that are not functions or methods.
function getMethodRanges(document: TextDocument): Range[] | undefined {
	const methodRanges: Range[] = [];
	let methodStartLine: number | undefined;
	let methodEndLine: number | undefined;
	let methodStartChar: number | undefined;
	let methodEndChar: number | undefined;
	let braceCount = 0;

	for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
		const lineText = document.lineAt(lineIndex).text;
		const openBracesCount = countCharOccurrences(lineText, '{');
		const closeBracesCount = countCharOccurrences(lineText, '}');

		braceCount += openBracesCount - closeBracesCount;

		if (braceCount > 0) {
			if (methodStartLine === undefined) {
				methodStartLine = lineIndex;
				methodStartChar = lineText.indexOf('{');
			}
		}

		if (braceCount === 0 && methodStartLine !== undefined) {
			methodEndLine = lineIndex;
			methodEndChar = lineText.lastIndexOf('}');
			if (methodStartChar !== undefined && methodEndChar !== undefined) {
				methodRanges.push(new Range(
					new Position(methodStartLine, methodStartChar),
					new Position(methodEndLine, methodEndChar)
				));
			}
			methodStartLine = undefined;
			methodStartChar = undefined;
			methodEndLine = undefined;
			methodEndChar = undefined;
		}
	}

	return methodRanges.length > 0 ? methodRanges : undefined;
}

function countCharOccurrences(text: string, char: string): number {
	return text.split(char).length - 1;
}

export function deactivate() { }