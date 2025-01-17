import { Tag } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'

interface Props {
  translated: boolean
}

export const TranslationTag = ({ translated }: Props) => {
  const { formatMessage } = useIntl()
  return translated ? (
    <Tag variant="mint">{formatMessage(m.translated)}</Tag>
  ) : (
    <Tag variant="red">{formatMessage(m.notTranslated)}</Tag>
  )
}
