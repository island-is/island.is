import { useFormSystemGetTranslationMutation } from "./getTranslation.generated"

export const translate = async (
  text: string,
  getTranslation = useFormSystemGetTranslationMutation()[0],
) => {
  const { data } = await getTranslation({
    variables: {
      input: {
        contents: [text],
      },
    },
  })
  return data?.formSystemGetTranslation.translations[0].translatedText ?? text
}
