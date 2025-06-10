import { useLazyQuery } from "@apollo/client"
import { useIntl } from "react-intl"
import {
  GET_ORGANIZATION_ADMIN,
} from '@island.is/form-system/graphql'
import { useContext, useState } from "react"
import { FormsContext } from "../../context/FormsContext"
import { Box, GridColumn, GridRow, Select, Text } from "@island.is/island-ui/core"
import { m } from '@island.is/form-system/ui'
import { FormSystemPermissionType } from '@island.is/api/schema'
import { Permission } from "./components/Permission"


export const Admin = () => {
  const { formatMessage } = useIntl()
  const [getAdminQuery] = useLazyQuery(GET_ORGANIZATION_ADMIN, {
    fetchPolicy: 'no-cache'
  })

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

  const handleOrganizationChange = async (selected: {
    value: string | undefined
  }) => {
    const updatedOrganizations = organizations.map((org) => ({
      ...org,
      isSelected: org.value === selected.value,
    }))
    setOrganizations(updatedOrganizations)

    const { data } = await getAdminQuery({
      variables: {
        input: {
          nationalId: selected.value,
        },
      },
    })

    const admin = data?.formSystenOrganizationAdmin
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
  }

  const sortPermissionsList = (list: FormSystemPermissionType[]) => {
    return list.sort((a, b) => Number(a.isCommon) - Number(b.isCommon))
  }

  const PermissionsHeader = () => (
    <GridColumn span='12/12'>
      <GridRow>
        {/* <Select
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
        /> */}
      </GridRow>
      <GridRow>
        <GridColumn span='4/12'>
          <Box>
            <Text variant="default" fontWeight="semiBold">
              {formatMessage(m.certifications)}
            </Text>
          </Box>
        </GridColumn>
        <GridColumn span='4/12'>
          <Box>
            <Text variant="default" fontWeight="semiBold">
              {formatMessage(m.lists)}
            </Text>
          </Box>
        </GridColumn>
        <GridColumn span='4/12'>
          <Box>
            <Text variant="default" fontWeight="semiBold">
              {formatMessage(m.inputFields)}
            </Text>
          </Box>
        </GridColumn>
      </GridRow>
    </GridColumn>
  )

  return (
    <Box marginTop={4}>
      <GridColumn span='12/12'>
        <PermissionsHeader />
        <GridRow>
          <GridColumn span='4/12'>
            <Box>
              <Permission type='certificate' />
            </Box>
          </GridColumn>
          <GridColumn span='4/12'>
            <Box>
              <Permission type="list" />
            </Box>
          </GridColumn>
          <GridColumn span='4/12'>
            <Box>
              <Permission type="field" />
            </Box>
          </GridColumn>
        </GridRow>
      </GridColumn>
    </Box>

  )
}