import { useLocale } from '@island.is/localization'
import { Text, Hidden, Box, Divider } from '@island.is/island-ui/core'
import classNames from 'classnames'

import * as styles from './access.css'

type AccessListHeaderProps = {
  hideValidityPeriod?: boolean
}

export const AccessListHeader = ({
  hideValidityPeriod = false,
}: AccessListHeaderProps) => {
  const { formatMessage } = useLocale()

  return (
    <Hidden below="lg">
      <Box className={classNames(styles.gridRow)} background="blue100">
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
        {!hideValidityPeriod && (
          <Text variant="medium" fontWeight="semiBold">
            {formatMessage({
              id: 'sp.settings-access-control:access-valid-to',
              defaultMessage: 'Í gildi til',
            })}
          </Text>
        )}
      </Box>
      <Divider />
    </Hidden>
  )
}
