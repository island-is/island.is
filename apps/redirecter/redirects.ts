/* eslint-disable @typescript-eslint/naming-convention */
// 👆 ESlint doesn't like paths as keys
// TODO: Set up as a database
export const redirects: Record<string, string | ((path: URL) => string)> = {
  '/test-nx': 'https://nx.dev',
  '/test-relative': '/about',
  '/test-absolute': (p: URL) => `${p.origin}/about`,
  '/test-func': (p: URL) =>
    `/about#${p.pathname.replace(/[aeiou]/g, '_').slice(1)}`,
  '/test-devland': 'https://island.is', //`https://beta.dev01.devland.is/`,
}
