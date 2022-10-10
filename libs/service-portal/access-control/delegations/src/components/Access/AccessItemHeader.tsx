import { useLocale, useNamespaces } from '@island.is/localization'
import { Text, GridRow, GridColumn, Hidden } from '@island.is/island-ui/core'

import * as styles from './AccessItemHeader.css'

type AccessItemHeaderProps = {
  hideValidityPeriod?: boolean
}

export const AccessItemHeader = ({
  hideValidityPeriod = false,
}: AccessItemHeaderProps) => {
  useNamespaces('sp.settings-access-control')
  const { formatMessage } = useLocale()

  return (
    <Hidden below="md">
      <GridRow className={styles.row}>
        <GridColumn
          span={['12/12', '12/12', '3/12']}
          paddingBottom={2}
          paddingTop={2}
          className={styles.column}
        >
          <Text variant="medium" fontWeight="semiBold">
            {formatMessage({
              id: 'sp.settings-access-control:access-access',
              defaultMessage: 'Aðgangur',
            })}
          </Text>
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '4/12', '5/12']}
          className={styles.column}
        >
          <Text variant="medium" fontWeight="semiBold">
            {formatMessage({
              id: 'sp.settings-access-control:access-explanation',
              defaultMessage: 'Útskýring',
            })}
          </Text>
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '5/12', '4/12']}
          className={styles.column}
        >
          {!hideValidityPeriod && (
            <Text variant="medium" fontWeight="semiBold">
              {formatMessage({
                id: 'sp.settings-access-control:access-valid-to',
                defaultMessage: 'Í gildi til',
              })}
            </Text>
          )}
        </GridColumn>
      </GridRow>
    </Hidden>
  )
}
