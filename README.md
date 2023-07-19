# Golang Collapse Funcs

![Extension Logo](logo.png)

With this extension you can collapse all methods and functions in the file you are working with by activating a single command.

## Features

- Automatically collapses all methods and functions into Go files.
- The cursor is positioned on the first line after collapsing the methods.
- You can expand all the collapsed blocks in the file with a single command.

## Demo

![Demo GIF](demo.gif)

## Use

1. Open a Go file in Visual Studio Code.
2. Use the command Ctrl+Shift+P and look for the "Collapse all funcs" command in the menu.
3. All methods and functions in the file will be collapsed automatically.
4. The cursor will be positioned on the first line after the collapsed methods.

## Commands

- `extension.collapseAllFuncs`: Collapse all methods in the current Go file..
- `extension.expandAllFuncs`: Expands all collapsed blocks in the current file.
