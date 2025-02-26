import { EducationPrimarySchoolStudentCareer } from '@island.is/api/schema'
import {
  FormatMessage,
  useLocale,
  useNamespaces,
} from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { Stack } from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import { EducationPaths } from '../../../lib/paths'
import {
  ActionCard,
  CardLoader,
  IntroWrapper,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { useOverviewQuery } from './Overview.generated'
import { m } from '../../../lib/messages'

export const EducationOverview = () => {
  useNamespaces('sp.education-overview')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useOverviewQuery()

  return (
    <IntroWrapper
      title={formatMessage(m.myEducation)}
      intro={formatMessage(m.myEducationIntro)}
      serviceProviderSlug={'menntamalastofnun'}
      serviceProviderTooltip={formatMessage(coreMessages.mmsTooltip)}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {loading && !error && <CardLoader />}
      {!error && !loading && !data && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(coreMessages.noData)}
          message={formatMessage(coreMessages.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      <Stack space={2}>
        <p>bebjbeje</p>
      </Stack>
    </IntroWrapper>
  )
}

export default EducationOverview
