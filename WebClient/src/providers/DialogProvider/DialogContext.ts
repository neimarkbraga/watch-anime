import { createContext } from 'react';
import {
	IAlertDialogOptions,
	IConfirmDialogContext,
	IConfirmDialogOptions,
	IDialogBaseContext,
	IPromptDialogContext,
	IPromptDialogOptions
} from './Dialog.types';

type InferResult<Context> = Context extends (value: infer Value) => void
	? Promise<Value>
	: Promise<void>;

export interface IDialogContext {
	alert: (
		message: IDialogBaseContext['message'],
		options?: Partial<IAlertDialogOptions>
	) => Promise<void>;

	confirm: (
		message: IDialogBaseContext['message'],
		options?: Partial<IConfirmDialogOptions>
	) => InferResult<IConfirmDialogContext['callback']>;

	prompt: (
		message: IDialogBaseContext['message'],
		options?: Partial<IPromptDialogOptions>
	) => InferResult<IPromptDialogContext['callback']>;
}

export const DialogContext = createContext<IDialogContext | null>(null);
