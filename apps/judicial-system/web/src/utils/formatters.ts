export const replaceTabs = (str: string) =>
  str?.replace(/(?: \t+|\t+ |\t+)/g, ' ')

export const getTextContentFromHtml = (html: string): string =>
  new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim() ??
  ''
