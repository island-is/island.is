export function lowerCase(str: string): string {
  const replacements = ['ÁÐÉÍÓÚÝÞÆÖ', 'áðéíóúýþæö']
  return str
    .replace(/[ÁÐÉÍÓÚÝÞÆÖ]/g, (m) =>
      replacements[1].charAt(replacements[0].indexOf(m)),
    )
    .toLowerCase()
}
