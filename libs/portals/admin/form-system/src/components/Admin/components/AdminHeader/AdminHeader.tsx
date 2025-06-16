import { Box, GridColumn, GridRow, Select, Text } from "@island.is/island-ui/core"
import { useIntl } from "react-intl"
import { m } from '@island.is/form-system/ui'
import {
  GET_ORGANIZATION_ADMIN,
} from '@island.is/form-system/graphql'
import { useLazyQuery } from "@apollo/client"
import { useContext } from "react"
import { FormsContext } from "../../../../context/FormsContext"
import * as styles from './AdminHeader.css'

export const AdminHeader = () => {
  const { formatMessage } = useIntl()
  const {
    setOrganizationId,
    setSelectedCertificationTypes,
    setSelectedListTypes,
    setSelectedFieldTypes,
    organizations,
    setOrganizations,
    organizationNationalId,
    setOrganizationNationalId,
  } = useContext(FormsContext)

  const [getAdminQuery] = useLazyQuery(GET_ORGANIZATION_ADMIN, {
    fetchPolicy: 'no-cache'
  })

  const handleOrganizationChange = async (selected: {
    value: string | undefined
  }) => {
    const updatedOrganizations = organizations.map((org) => ({
      ...org,
      isSelected: org.value === selected.value,
    }))
    setOrganizations(updatedOrganizations)

    try {
      const { data } = await getAdminQuery({
        variables: {
          input: {
            nationalId: selected.value,
          },
        },
      })

      const admin = data?.formSystemOrganizationAdmin
      const { organizationId, selectedCertificationTypes, selectedListTypes, selectedFieldTypes } = admin

      if (organizationId) {
        setOrganizationId(organizationId)
      }
      if (selectedCertificationTypes) {
        setSelectedCertificationTypes(selectedCertificationTypes)
      }
      if (selectedListTypes) {
        setSelectedListTypes(selectedListTypes)
      }
      if (selectedFieldTypes) {
        setSelectedFieldTypes(selectedFieldTypes)
      }
    } catch (error) {
      console.error('Error fetching organization admin:', error)
    }
  }

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
            value={organizations.find(org => org.value === organizationNationalId)}
            onChange={async (selected) => {
              if (selected) {
                setOrganizationNationalId(selected.value)
                handleOrganizationChange({ value: selected.value })
              }
            }}
          />
        </Box>
      </Box>
      <Box className={styles.header}>
        <GridRow>
          <GridColumn span='4/12'>
            <Box marginLeft={1}>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.certifications)}
              </Text>
            </Box>
          </GridColumn>
          <GridColumn span='4/12'>
            <Box>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.lists)}
              </Text>
            </Box>
          </GridColumn>
          <GridColumn span='4/12'>
            <Box>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.inputFields)}
              </Text>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
    </Box >
  )
}