import { m } from '@island.is/form-system/ui'
import { Box, Select } from '@island.is/island-ui/core'
import { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useSearchParams } from 'react-router-dom'
import { FormsContext } from '../context/FormsContext'

export const OrganizationSelect = () => {
  const { formatMessage } = useIntl()
  const {
    organizations,
    organizationNationalId,
    setOrganizationNationalId,
    handleOrganizationChange,
  } = useContext(FormsContext)

  const [, setSearchParams] = useSearchParams()

  const sortedOrganizations = useMemo(
    () =>
      [...organizations].sort((a, b) =>
        (a.label ?? '').localeCompare(b.label ?? '', 'is', {
          sensitivity: 'base',
        }),
      ),
    [organizations],
  )

  return (
    <Box style={{ width: '40%' }}>
      <Select
        name="organizations"
        label={formatMessage(m.organization)}
        options={sortedOrganizations}
        size="sm"
        value={sortedOrganizations.find(
          (org) => org.value === organizationNationalId,
        )}
        onChange={async (selected) => {
          if (selected && handleOrganizationChange) {
            handleOrganizationChange({ value: selected.value })
            setSearchParams({ organizationNationalId: selected.value })
          }
        }}
      />
    </Box>
  )
}
