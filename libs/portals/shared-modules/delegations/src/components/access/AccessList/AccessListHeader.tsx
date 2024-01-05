import { useLocale } from '@island.is/localization'
import { Text, Box, TextProps, BoxProps } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { formatDelegationDate } from '../access.utils'

const commonTextProps: Partial<TextProps> = {
  variant: 'medium',
  fontWeight: 'semiBold',
}

const commonItemProps: Partial<BoxProps> = {
  background: 'blue100',
  paddingY: 2,
}

type AccessListHeaderProps = {
  validityPeriod?: Date | null
}

export const AccessListHeader = ({ validityPeriod }: AccessListHeaderProps) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box {...commonItemProps} paddingLeft={2}>
        <Text {...commonTextProps}>{formatMessage(m.category)}</Text>
      </Box>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        {...commonItemProps}
        {...(validityPeriod && { paddingRight: 2 })}
      >
        <Text {...commonTextProps}>{formatMessage(m.permission)}</Text>
        {validityPeriod && (
          <Box textAlign="right">
            <Text {...commonTextProps}>
              {formatMessage(m.validTo)}
              {` ${formatDelegationDate(validityPeriod)}`}
            </Text>
          </Box>
        )}
      </Box>
      {!validityPeriod && (
        <Box {...commonItemProps} paddingRight={2}>
          <Text {...commonTextProps}>{formatMessage(m.validTo)}</Text>
        </Box>
      )}
    </>
  )
}
