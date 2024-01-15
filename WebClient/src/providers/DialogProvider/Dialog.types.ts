import { DialogProps, TextFieldProps } from '@mui/material';
import { ReactNode } from 'react';

// Options ===================================
export interface IDialogBaseOptions {
	title: string;
	dialogProps: Partial<DialogProps>;
}

export interface IAlertDialogOptions extends IDialogBaseOptions {
	okLabel: string;
}

export interface IConfirmDialogOptions extends IDialogBaseOptions {
	confirmLabel: string;
	cancelLabel: string;
}

export interface IPromptDialogOptions extends IDialogBaseOptions {
	textFieldProps: Partial<TextFieldProps>;
	placeholder: string;
	submitLabel: string;
	cancelLabel: string;
}

// Contexts ===================================
export interface IDialogBaseContext {
	id: string;
	open: boolean;
	message: ReactNode;
}

export interface IAlertDialogContext extends IDialogBaseContext, IAlertDialogOptions {
	callback: () => void;
}

export interface IConfirmDialogContext extends IDialogBaseContext, IConfirmDialogOptions {
	callback: (value: boolean) => void;
}

export interface IPromptDialogContext extends IDialogBaseContext, IPromptDialogOptions {
	callback: (value?: string) => void;
}

// Types ===================================
export interface IDialogTypes {
	alert: IAlertDialogContext;
	confirm: IConfirmDialogContext;
	prompt: IPromptDialogContext;
}
