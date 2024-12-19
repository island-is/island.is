import { GET_TRANSLATION } from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'
import { FormSystemTranslation } from '@island.is/api/schema'

export const getTranslation = async (text: string) => {
  const [getTranslationMutation] = useMutation(GET_TRANSLATION)

  try {
    const { data } = await getTranslationMutation({
      variables: {
        input: {
          textTotranslate: text,
        },
      },
    })

    if (!data) {
      throw new Error('Loading')
    }

    if (!data || !data.getTranslation) {
      throw new Error('No translation data found')
    }

    const response: FormSystemTranslation = data.getTranslation

    return response.translations[0]
  } catch (err) {
    console.error('Error occurred while getting translation:', err)
    throw err
  }
}
