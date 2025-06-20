import {
  Box,
  GridColumn,
  GridRow,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { useContext } from 'react'
import { FormsContext } from '../../../../context/FormsContext'
import * as styles from './AdminHeader.css'

export const AdminHeader = () => {
  const { formatMessage } = useIntl()
  const {
    organizations,
    organizationNationalId,
    setOrganizationNationalId,
    handleOrganizationChange,
  } = useContext(FormsContext)

  return (
    <Box marginTop={5}>
      <Box marginTop={5} marginBottom={5}>
        <Box
          marginRight={1}
          display="flex"
          justifyContent="flexEnd"
          width="full"
        >
          <Select
            name="organizations"
            label={formatMessage(m.organization)}
            options={organizations}
            size="sm"
            value={organizations.find(
              (org) => org.value === organizationNationalId,
            )}
            onChange={async (selected) => {
              if (selected && handleOrganizationChange) {
                setOrganizationNationalId(selected.value)
                handleOrganizationChange({ value: selected.value })
              }
            }}
          />
        </Box>
      </Box>
      <Box className={styles.header}>
        <GridRow>
          <GridColumn span="4/12">
            <Box marginLeft={1}>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.certifications)}
              </Text>
            </Box>
          </GridColumn>
          <GridColumn span="4/12">
            <Box>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.lists)}
              </Text>
            </Box>
          </GridColumn>
          <GridColumn span="4/12">
            <Box>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.inputFields)}
              </Text>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
    </Box>
  )
}
