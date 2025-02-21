import { EducationPrimarySchoolStudentCareer } from '@island.is/api/schema'
import {
  FormatMessage,
  useLocale,
  useNamespaces,
} from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { Stack } from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import { EducationPaths } from '../../lib/paths'
import {
  ActionCard,
  CardLoader,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { useFamilySchoolCareerQuery } from './PrimarySchoolFamilyExamOverview.generated'
import { edMessage } from '../../lib/messages'

const generateActionCard = (
  name: string,
  dateSpan: string,
  slug: string,
  formatMessage: FormatMessage,
) => (
  <ActionCard
    image={{ type: 'avatar' }}
    translateLabel="no"
    heading={name}
    text={`${formatMessage(edMessage.examDateSpan)}: ${dateSpan}`}
    tag={{
      label: formatMessage(edMessage.studentAssessment),
      variant: 'purple',
    }}
    cta={{
      label: formatMessage(m.seeDetails),
      variant: 'text',
      url: EducationPaths.EducationPrimarySchoolAssessmentDetail.replace(
        ':id',
        slug,
      ),
    }}
  />
)

export const PrimarySchoolFamilyExamOverview = () => {
  useNamespaces('sp.education-student-assessment')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useFamilySchoolCareerQuery()

  const userCareer: EducationPrimarySchoolStudentCareer | null =
    data?.userFamilyExamResults.userCareer ?? null

  const familyCareer: Array<EducationPrimarySchoolStudentCareer> | null =
    data?.userFamilyExamResults.familyMemberCareers ?? null

  const careers: Array<React.ReactNode> = [
    userCareer?.name && userCareer?.examDateSpan
      ? generateActionCard(
          userCareer.name,
          userCareer.examDateSpan,
          'default',
          formatMessage,
        )
      : undefined,
    familyCareer
      ?.map((f) => {
        if (!f.name || !f.examDateSpan) {
          return undefined
        }
        return generateActionCard(f.name, f.examDateSpan, 'bha', formatMessage)
      })
      .filter(isDefined),
  ].filter(isDefined)

  return (
    <IntroWrapper
      title={formatMessage(edMessage.assessment)}
      intro={formatMessage(edMessage.studentAssessmentIntroText)}
      serviceProviderSlug={'menntamalastofnun'}
      serviceProviderTooltip={formatMessage(m.mmsTooltip)}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {loading && !error && <CardLoader />}
      {!error && !loading && !userCareer && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      <Stack space={2}>
        {careers.length > 0 && !loading && !error && careers}
      </Stack>
    </IntroWrapper>
  )
}

export default PrimarySchoolFamilyExamOverview
