import { m } from '@island.is/form-system/ui'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import * as styles from '../../../tableHeader.css'
import { Permission } from './Permission'

const SECTIONS = [
  { key: 'certifications', type: 'certificate' as const },
  { key: 'lists', type: 'list' as const },
  { key: 'inputFields', type: 'field' as const },
] as const

export const Permissions = () => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Box display={['none', 'none', 'block']} className={styles.header}>
        <GridRow>
          {SECTIONS.map(({ key }) => (
            <GridColumn key={key} span="4/12">
              <Box marginLeft={1}>
                <Text variant="medium" fontWeight="semiBold">
                  {formatMessage(m[key as keyof typeof m])}
                </Text>
              </Box>
            </GridColumn>
          ))}
        </GridRow>
      </Box>

      <GridRow>
        {SECTIONS.map(({ key, type }) => (
          <GridColumn key={type} span={['12/12', '12/12', '4/12']}>
            {/* Per-section title — mobile only */}
            <Box
              display={['block', 'block', 'none']}
              className={styles.header}
              marginTop={2}
            >
              <Box marginLeft={1}>
                <Text variant="medium" fontWeight="semiBold">
                  {formatMessage(m[key as keyof typeof m])}
                </Text>
              </Box>
            </Box>
            <Permission type={type} />
          </GridColumn>
        ))}
      </GridRow>
    </>
  )
}
