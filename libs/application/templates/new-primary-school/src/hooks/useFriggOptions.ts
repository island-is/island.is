import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { friggOptionsQuery } from '../graphql/queries'
import { OptionsType, OTHER_OPTION } from '../utils/constants'

export const useFriggOptions = (type?: OptionsType, useIdAndKey = false) => {
  const { lang } = useLocale()
  const { data, loading, error } = useQuery<Query>(friggOptionsQuery, {
    variables: {
      type: {
        type,
      },
    },
  })

  let otherIndex = -1

  const options =
    data?.friggOptions?.flatMap(({ options }) =>
      options.flatMap(({ value, key, id }, index) => {
        const content = value.find(({ language }) => language === lang)?.content

        if (!content) return []

        if (key === OTHER_OPTION) otherIndex = index

        const contentValue = useIdAndKey ? `${id}::${key}` : id

        return { value: contentValue, label: content }
      }),
    ) ?? []

  if (otherIndex >= 0) {
    options.push(options.splice(otherIndex, 1)[0])
  }

  return { options, loading, error }
}
