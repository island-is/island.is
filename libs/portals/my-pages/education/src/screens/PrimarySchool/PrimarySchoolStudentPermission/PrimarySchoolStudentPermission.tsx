import { LinkButton, m } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { primarySchoolMessages as psm } from '../../../lib/messages'

export const PrimarySchoolStudentPermission = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()

  return (
    <>
      <LinkButton
        to={formatMessage(psm.headerLinkButtonUrl)}
        text={formatMessage(psm.headerLinkButtonText)}
        variant="utility"
        icon="open"
      />
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
    </>
  )
}

export default PrimarySchoolStudentPermission
