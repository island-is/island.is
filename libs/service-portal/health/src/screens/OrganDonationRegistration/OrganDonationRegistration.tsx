import { useLocale, useNamespaces } from '@island.is/localization'
import { Box } from 'reakit'
import { getOptions } from '../../utils/OrganDonationMock'

const OrganDonationRegistration = () => {
  useNamespaces('sp.health')

  const { formatMessage, lang } = useLocale()
  const { data, loading, error } = getOptions(lang)

  return <Box>{'þetta er líffæragjöf'}</Box>
}

export default OrganDonationRegistration
