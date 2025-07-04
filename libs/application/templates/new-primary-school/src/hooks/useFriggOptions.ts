import { useQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { friggOptionsQuery } from '../graphql/queries'
import { OptionsType } from '../lib/constants'
import { FriggOptionsQuery } from '../types/schema'

export const useFriggOptions = (
  type?: OptionsType,
  useId = false,
  useIdAndKey = false,
) => {
  const { lang } = useLocale()
  const { data, loading, error } = useQuery<FriggOptionsQuery>(
    friggOptionsQuery,
    {
      variables: {
        type: {
          type,
        },
      },
    },
  )

  const options =
    data?.friggOptions?.flatMap(({ options }) =>
      options.flatMap(({ value, key, id }) => {
        const content = value.find(({ language }) => language === lang)?.content

        if (!content) return []

        const contentValue = useIdAndKey ? `${id}::${key}` : useId ? id : key

        return { value: contentValue, label: content }
      }),
    ) ?? []

  const otherIndex = options.findIndex((option) => option.value === 'other')

  if (otherIndex >= 0) {
    options.push(options.splice(otherIndex, 1)[0])
  }

  return { options, loading, error }
}
