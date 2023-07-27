function extractText(value: string) {
  const texts: string[] = []
  texts.push(value)
  return texts
}

function createValue(texts: string[], scaffold?: any) {
  return texts[0]
}

const functions = {
  extractText,
  createValue,
}

export default functions
