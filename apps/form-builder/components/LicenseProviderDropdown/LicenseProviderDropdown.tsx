import { Box, Select } from '@island.is/island-ui/core'
import { ILicenseProvider } from '../../types/interfaces'

interface LicenseProviderDropdownProps {
  licenseProviders: ILicenseProvider[]
  setSelectProvider: (value: number) => void
}

function mappedProviders(licenseProviders: ILicenseProvider[]) {
  const lp = licenseProviders
    .filter((lp) => lp.name.length > 0 && lp.language === 'is')
    .map((lp) => ({
      label: lp.name,
      value: lp.licenseProviderID,
    }))
  return lp.sort((a, b) => a.label.localeCompare(b.label))
}

export default function LicenseProviderDropdown({
  licenseProviders,
  setSelectProvider,
}: LicenseProviderDropdownProps) {
  const handleChange = (e: { value: number }) => {
    setSelectProvider(e.value)
  }
  return (
    <Box style={{ width: '30%' }}>
      <Select
        icon="menu"
        name="select"
        label="Stofnun"
        noOptionsMessage="Veldu stofnun"
        placeholder="Veldu stofnun"
        options={mappedProviders(licenseProviders)}
        onChange={handleChange}
        size={'sm'}
      />
    </Box>
  )
}
