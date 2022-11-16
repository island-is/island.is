import { useLocale } from '@island.is/localization'
import {
  Text,
  Hidden,
  Box,
  Divider,
  TextProps,
} from '@island.is/island-ui/core'
import classNames from 'classnames'
import { formatDelegationDate } from '../access.utils'
import * as styles from '../access.css'

const commonTextProps: Partial<TextProps> = {
  variant: 'medium',
  fontWeight: 'semiBold',
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
    <Hidden below="lg">
      <Box
        className={classNames(
          styles.gridRow,
          validityPeriod
            ? styles.gridRowMaxTwoCols
            : styles.gridRowMaxThreeCols,
        )}
        background="blue100"
      >
        <Text {...commonTextProps}>
          {formatMessage({
            id: 'sp.settings-access-control:access-access',
            defaultMessage: 'Flokkur',
          })}
        </Text>
        <Box
          {...(validityPeriod && {
            display: 'flex',
            justifyContent: 'spaceBetween',
            alignItems: 'center',
          })}
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
          <Text {...commonTextProps}>{formatMessage(validToTranslation)}</Text>
        )}
      </Box>
      <Divider />
    </Hidden>
  )
}
