import { Select } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { useContext } from 'react'
import { FormsContext } from '../context/FormsContext'

export const OrganizationSelect = () => {
  const { formatMessage } = useIntl()
  const {
    organizations,
    organizationNationalId,
    setOrganizationNationalId,
    handleOrganizationChange,
  } = useContext(FormsContext)

  return (
    <Select
      name="organizations"
      label={formatMessage(m.organization)}
      options={organizations}
      size="sm"
      value={organizations.find((org) => org.value === organizationNationalId)}
      onChange={async (selected) => {
        if (selected && handleOrganizationChange) {
          setOrganizationNationalId(selected.value)
          handleOrganizationChange({ value: selected.value })
        }
      }}
    />
  )
}
