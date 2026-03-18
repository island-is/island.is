import { useState } from 'react'
import { IntroWrapper, m, MMS_SLUG } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Input } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { primarySchoolMessages as psm } from '../../../lib/messages'

export const PrimarySchoolStudentPermission = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const [searchValue, setSearchValue] = useState('')

  return (
    <IntroWrapper
      title={psm.permissionTitle}
      intro={psm.permissionIntro}
      serviceProviderSlug={MMS_SLUG}
    >
      <Box marginBottom={3}>
        <Input
          name="permission-search"
          placeholder={formatMessage(psm.filterByKeyword)}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Box>
      {/* TODO: replace with real permission data when permissions API is available */}
      <Box marginTop={5}>
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      </Box>
    </IntroWrapper>
  )
}

export default PrimarySchoolStudentPermission
