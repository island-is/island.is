import { useLocale } from '@island.is/localization'
import { Text, Box, TextProps, BoxProps } from '@island.is/island-ui/core'
import { formatDelegationDate } from '../access.utils'

const commonTextProps: Partial<TextProps> = {
  variant: 'medium',
  fontWeight: 'semiBold',
}

const commonItemProps: Partial<BoxProps> = {
  background: 'blue100',
  paddingY: 2,
}

const validToTranslation = {
  id: 'sp.settings-access-control:access-valid-to',
  defaultMessage: 'Í gildi til',
}

type AccessListHeaderProps = {
  validityPeriod?: Date | null
}

export const AccessListHeader = ({ validityPeriod }: AccessListHeaderProps) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box {...commonItemProps} paddingLeft={2}>
        <Text {...commonTextProps}>
          {formatMessage({
            id: 'sp.settings-access-control:access-access',
            defaultMessage: 'Flokkur',
          })}
        </Text>
      </Box>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        {...commonItemProps}
        {...(validityPeriod && { paddingRight: 2 })}
      >
        <Text {...commonTextProps}>
          {formatMessage({
            id: 'sp.settings-access-control:access-explanation',
            defaultMessage: 'Heimild',
          })}
        </Text>
        {validityPeriod && (
          <Box textAlign="right">
            <Text {...commonTextProps}>
              {formatMessage(validToTranslation)}
              {` ${formatDelegationDate(validityPeriod)}`}
            </Text>
          </Box>
        )}
      </Box>
      {!validityPeriod && (
        <Box {...commonItemProps} paddingRight={2}>
          <Text {...commonTextProps}>{formatMessage(validToTranslation)}</Text>
        </Box>
      )}
    </>
  )
}
