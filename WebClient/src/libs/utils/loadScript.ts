export const loadScript = (options: Partial<HTMLScriptElement>) => {
	return new Promise((resolve, reject) => {
		try {
			// remove existing scripts
			const existingScripts = Array.from(document.getElementsByTagName('script'));
			for (const existingScript of existingScripts) {
				if (existingScript.src !== options.src) continue;
				existingScript.remove();
			}

			// create script element
			const status = { done: false };
			const script = Object.assign(document.createElement('script'), options);

			// handle onload
			script.onload = () => {
				if (status.done) return;
				status.done = true;
				resolve(script);
			};

			// handle onerror
			script.onerror = () => {
				if (status.done) return;
				status.done = true;
				reject(new Error(`Unable to load script: ${options.src}`));
			};

			// add to body
			document.body.append(script);
		} catch (e) {
			reject(e);
		}
	});
};
