const nbsp = String.fromCharCode(160)
const regex = /\s(?=[^\s]*$)/g

/**
 * This function takes a sentence of words and prevents the last
 * two words from separating by inserting `&nbsp;` between them.
 */
export const deorphanize = (text: string) => text.replace(regex, nbsp)
