const base = 'https://stafraentisland.greynir.is/translate/'
const base2 = 'http://localhost:2929/'

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

async function sendTexts(iceTexts: string[], enTexts: string[]) {
  const body: any = {
    ice: iceTexts,
    en: enTexts
  }

  console.log(body)

  //const response = await fetch(base2, {
  //  method: 'POST',
  //  mode: 'no-cors',
  //  headers: {
  //    'Content-Type': 'application/json'
  //  },
  //  body: JSON.stringify(body)
  //})
}

export { translateTexts, sendTexts }
