import { IntroWrapper, m, MMS_SLUG } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { primarySchoolMessages as psm } from '../../lib/messages'

export const PrimarySchoolStudentPermission = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()

  return (
    <IntroWrapper
      title={psm.permissionTitle}
      intro={psm.permissionIntro}
      serviceProviderSlug={MMS_SLUG}
    >
      <Box marginTop={8}>
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
