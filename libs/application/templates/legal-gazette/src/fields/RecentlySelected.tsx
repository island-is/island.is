import { Inline, Tag, Text } from '@island.is/island-ui/core'
import { LGFieldBaseProps } from '../lib/types'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'

export const RecentlySelected = ({ application }: LGFieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { recentAdvertTypes } = application.externalData

  if (recentAdvertTypes?.status !== 'success') {
    return null
  }

  const onSelect = (tag: string) => {
    console.log(tag)
  }

  return (
    <Inline alignY="center" space={1}>
      <Text>{formatMessage(m.requirements.advertType.recentlySelected)}:</Text>
      {recentAdvertTypes.data.map((opt) => (
        <Tag onClick={() => onSelect(opt.value)} key={opt.value}>
          {opt.label}
        </Tag>
      ))}
    </Inline>
  )
}

export default RecentlySelected
