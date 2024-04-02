import { ITranslationResponse } from '../types/interfaces'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export const translationStation = async (
  input: string,
): Promise<ITranslationResponse> => {
  const apiUrl = process.env.MIDEIND_API
  const apiKey = process.env.MIDEIND_KEY

  if (!apiUrl || !apiKey) {
    throw new Error('API URL or API key is not defined.')
  }

  try {
    const response = await axios.post(
      apiUrl,
      {
        contents: [input],
        sourceLanguageCode: 'is',
        targetLanguageCode: 'en',
        model: '',
        domain: '',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-API-Key': apiKey,
        },
      },
    )

    return response.data
  } catch (error) {
    console.error('Error in translationStation: ', error)
    throw error
  }
}
