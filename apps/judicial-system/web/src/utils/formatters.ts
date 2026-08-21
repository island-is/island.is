import { containsHtml } from '@island.is/judicial-system/formatters'

export const replaceTabs = (str: string) =>
  str?.replace(/(?: \t+|\t+ |\t+)/g, ' ')

const escapeHtml = (str: string) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Converts plain text to the paragraph-based HTML the TinyMCE editor produces,
// one <p> per line. Text that already contains markup is passed through so
// stored rich text is not double-escaped.
export const textToHtml = (str: string) =>
  !str || containsHtml(str)
    ? str
    : str
        .split('\n')
        .map((line) => `<p>${escapeHtml(line)}</p>`)
        .join('')
