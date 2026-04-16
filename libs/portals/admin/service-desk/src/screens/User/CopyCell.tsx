import { Box, Icon, Text, Tooltip, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'

interface Props {
  value: string | null | undefined
  maxWidth?: number
}

export const CopyCell = ({ value, maxWidth = 220 }: Props) => {
  const { formatMessage } = useLocale()

  if (!value) return null

  const handleCopy = () => {
    navigator.clipboard
      .writeText(value)
      .then(() => toast.success(formatMessage(m.copyValueSuccess)))
  }

  return (
    <Box display="flex" alignItems="center" columnGap={1}>
      <Box style={{ maxWidth }} title={value}>
        <Text variant="small" truncate>
          {value}
        </Text>
      </Box>
      <Tooltip text={formatMessage(m.copyValue)}>
        <button
          type="button"
          aria-label={formatMessage(m.copyValue)}
          onClick={handleCopy}
        >
          <Icon type="outline" color="blue400" icon="copy" size="small" />
        </button>
      </Tooltip>
    </Box>
  )
}
