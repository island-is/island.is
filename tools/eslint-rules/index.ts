// Nx workspace lint rules registry. There are no custom workspace rules yet;
// this empty export satisfies @nx/eslint-plugin's workspace-rule loader, which
// otherwise logs a "Cannot find module 'tools/eslint-rules'" error on every lint.
export const rules = {}
