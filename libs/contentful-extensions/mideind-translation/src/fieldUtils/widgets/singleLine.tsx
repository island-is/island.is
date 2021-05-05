function extractText(value: any) {
  var texts: string[] = []
  texts.push(value)
  return texts
}

function createValue(texts: string[], scaffold?: any) {
  return texts[0]
}

export default {
  extractText,
  createValue,
}
