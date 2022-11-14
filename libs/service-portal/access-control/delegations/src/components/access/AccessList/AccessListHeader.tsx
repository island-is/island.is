import { useLocale } from '@island.is/localization'
import { Text, Hidden, Box, Divider } from '@island.is/island-ui/core'
import classNames from 'classnames'
import format from 'date-fns/format'
import { DATE_FORMAT } from '../access.utils'
import * as styles from '../access.css'

type AccessListHeaderProps = {
  validityPeriod?: string
}

export const AccessListHeader = ({ validityPeriod }: AccessListHeaderProps) => {
  const { formatMessage } = useLocale()

  return (
    <Hidden below="lg">
      <Box
        className={classNames(
          styles.gridRow,
          validityPeriod
            ? styles.gridRowValidityPeriod
            : styles.gridRowMaxThreeCols,
        )}
        background="blue100"
      >
        <Text variant="medium" fontWeight="semiBold">
          {formatMessage({
            id: 'sp.settings-access-control:access-access',
            defaultMessage: 'Aðgangur',
          })}
        </Text>
        <Text variant="medium" fontWeight="semiBold">
          {formatMessage({
            id: 'sp.settings-access-control:access-explanation',
            defaultMessage: 'Útskýring',
          })}
        </Text>
        {
          <Box {...(validityPeriod && { textAlign: 'right' })}>
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage({
                id: 'sp.settings-access-control:access-valid-to',
                defaultMessage: 'Í gildi til',
              })}
              {validityPeriod &&
                ` ${format(new Date(validityPeriod), DATE_FORMAT)}`}
            </Text>
          </Box>
        }
      </Box>
      <Divider />
    </Hidden>
  )
}
