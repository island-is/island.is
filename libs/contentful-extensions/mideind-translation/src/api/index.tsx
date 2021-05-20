const base = 'https://stafraentisland.greynir.is/translate'

const defaultParams = {
  sourceLanguageCode: 'is',
  targetLanguageCode: 'en',
}

async function translateTexts(texts: string[]) {
  var translations = []
  const body: any = {
    contents: texts,
    ...defaultParams,
  }

  const response = await fetch(`${base}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.MIDEIND_TOKEN || '',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json())

  for (const translation of response.translations) {
    translations.push(translation.translatedText.trim())
  }

  return translations
}

async function sendTexts(iceTexts: string[], enTexts: string[], reference: string) {
  const body: any = {
    machineTranslatedText: '',  // Required even if empty
    translationReference: 1 || reference,  // Reference to be accepted later by Miðeind
    originalText: iceTexts.join(" "), // String expected, not array
    correctedText: enTexts.join(" "), // String expected, not array
    languagePair: 'is-en',
    model: 'transformer-base'
  }

  const response = await fetch(`${base}/corrected`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.MIDEIND_TOKEN || '',
    },
    body: JSON.stringify(body)
  })
}

export { translateTexts, sendTexts }
