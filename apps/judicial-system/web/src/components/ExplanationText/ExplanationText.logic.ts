// Explanations saved before line breaks were stored as newlines separate
// their lines with a break tag
export const toExplanationLines = (explanation: string): string =>
  explanation.replace(/<br\s*\/?>/gi, '\n')
