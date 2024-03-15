const defaultParams = {
  sourceLanguageCode: 'is',
  targetLanguageCode: 'en',
}

async function translateTexts(
  texts: string[],
  apiKey: string,
  baseUrl: string,
  model?: string,
) {
  const translations = []
  const body = {
    contents: texts,
    model,
    ...defaultParams,
  }

  const response = await fetch(`${baseUrl}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(body),
  }).then((res) => res.json())

  for (const translation of response.translations) {
    translations.push(translation.translatedText.trim())
  }

  return translations
}

async function sendTexts(
  iceTexts: string[],
  enTexts: string[],
  reference: string,
  apiKey: string,
  baseUrl: string,
  model?: string,
  userReference?: string,
) {
  const body = {
    machineTranslatedText: '', // Required even if empty
    translationReference: 1 || reference, // Reference to be accepted later by Miðeind
    originalText: iceTexts.join(' '), // String expected, not array
    correctedText: enTexts.join(' '), // String expected, not array
    languagePair: 'is-en',
    model,
    userReference: userReference,
  }

  await fetch(`${baseUrl}/corrected`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(body),
  })
}

export { translateTexts, sendTexts }
