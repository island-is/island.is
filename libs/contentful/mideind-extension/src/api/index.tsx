const base = 'https://stafraentisland.greynir.is/translate/'

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

  const response = await fetch(base, {
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

export { translateTexts }
