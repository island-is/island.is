import { Box, GridColumn, GridRow, Select, Text } from "@island.is/island-ui/core"
import { useIntl } from "react-intl"
import * as styles from './ApplicationsHeader.css'
import { m } from '@island.is/form-system/ui'
import { useContext } from "react"
import { FormsContext } from "../../../../context/FormsContext"
import { useLazyQuery } from "@apollo/client"
import { GET_APPLICATIONS } from "@island.is/form-system/graphql"


export const ApplicationsHeader = () => {
  const { formatMessage } = useIntl()
  const {
    organizations,
    setOrganizations,
    setApplications,
    organizationNationalId,
    setOrganizationNationalId,
  } = useContext(FormsContext)

  const [getApplications] = useLazyQuery(GET_APPLICATIONS, {
    fetchPolicy: 'no-cache',
  })
  const handleOrganizationChange = async (selected: { value: string }) => {
    const updatedOrganizations = organizations.map((org) => ({
      ...org,
      isSelected: org.value === selected.value,
    }))
    setOrganizations(updatedOrganizations)

    try {
      const { data } = await getApplications({
        variables: {
          input: {
            organizationNationalId: selected.value,
            page: 1,
            limit: 20,
            isTest: true,
          },
        },
      })
      if (data?.formSystemApplications?.applications) {
        setApplications(data?.formSystemApplications?.applications)
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    }
  }

  return (
    <Box marginTop={5}>
      <Box marginTop={5} marginBottom={5}>
        <Box
          display="flex"
          justifyContent="flexEnd"
          width="full"
          marginRight={1}
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
          <GridColumn span="4/12">
            <Box paddingLeft={2}>
              <Text variant="medium" fontWeight="semiBold">{formatMessage(m.submitted)}</Text>
            </Box>
          </GridColumn>
          <GridColumn span="4/12">
            <Text variant="medium" fontWeight="semiBold">{formatMessage(m.nationalId)}</Text>
          </GridColumn>
          <GridColumn span="4/12">
            <Text variant="medium" fontWeight="semiBold">{formatMessage(m.state)}</Text>
          </GridColumn>
        </GridRow>
      </Box>
    </Box>
  )
}
