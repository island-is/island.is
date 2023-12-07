/* eslint-disable @typescript-eslint/naming-convention */
// 👆 ESlint doesn't like paths as keys
// TODO: Set up as a database
export const redirects: Record<string, string | ((path: URL) => string)> = {
  '/test-nx': 'https://nx.dev',
  '/test-relative': '/foo',
  '/test-func': (p: URL) => `${p.pathname.replace(/[aeiou]/g, '_')}`,
  '/test-devland': (p: URL) =>
    `https://beta.dev01.devland.is${p.pathname.replace(/-/g, '/')}`,
}
