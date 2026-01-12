import { useIntl } from 'react-intl'

import { strings } from './useLawTag.strings'

const useLawTag = () => {
  const { formatMessage } = useIntl()

  const lawTag = (law: number[]) => {
    const article = law[0]
    const paragraph = law[1]

    if (paragraph === 0) {
      return formatMessage(strings.lawsBrokenTagArticleOnly, {
        article,
      })
    } else {
      return formatMessage(strings.lawsBrokenTag, {
        article,
        paragraph,
      })
    }
  }

  return lawTag
}

export default useLawTag
