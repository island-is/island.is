import { useIntl } from 'react-intl'

import { strings } from './useLawTag.strings'

const useLawTag = () => {
  const { formatMessage } = useIntl()

  const lawTag = (law: number[]) => {
    const article = law[0]
    const paragraph = law[1]

    if (paragraph === 0) {
      return formatMessage(
        {
          id: strings.lawsBrokenTagArticleOnly,
          defaultMessage: strings.lawsBrokenTagArticleOnly,
        },
        {
          article,
        },
      )
    } else {
      return formatMessage(
        {
          id: strings.lawsBrokenTag,
          defaultMessage: strings.lawsBrokenTag,
        },
        {
          article,
          paragraph,
        },
      )
    }
  }

  return lawTag
}

export default useLawTag
