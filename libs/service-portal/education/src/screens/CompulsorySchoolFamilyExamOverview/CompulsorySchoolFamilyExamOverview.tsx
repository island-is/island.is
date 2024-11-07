import {
  ActionCard,
  CardLoader,
  IntroWrapper,
  m,
} from '@island.is/service-portal/core'
import { useFamilySchoolCareerQueryQuery } from './CompulsorySchoolFamilyExamOverview.generated'
import { EducationCompulsorySchoolStudentCareer } from '@island.is/api/schema'
import { compulsorySchoolMessages } from '../../lib/messages'
import {
  FormatMessage,
  useLocale,
  useNamespaces,
} from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { Stack } from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import { EducationPaths } from '../../lib/paths'

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
    text={`${formatMessage(
      compulsorySchoolMessages.examDateSpan,
    )}: ${dateSpan}`}
    tag={{
      label: formatMessage(compulsorySchoolMessages.studentAssessment),
      variant: 'purple',
    }}
    cta={{
      label: formatMessage(m.seeDetails),
      variant: 'text',
      url: EducationPaths.EducationCompulsorySchoolAssessmentDetail.replace(
        ':id',
        slug,
      ),
    }}
  />
)

export const CompulsorySchoolFamilyExamOverview = () => {
  useNamespaces('sp.education-student-assessment')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useFamilySchoolCareerQueryQuery()

  const userCareer: EducationCompulsorySchoolStudentCareer | null =
    data?.userFamilyExamResults.userCareer ?? null

  const familyCareer: Array<EducationCompulsorySchoolStudentCareer> | null =
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
      title={formatMessage(compulsorySchoolMessages.assessment)}
      intro={formatMessage(compulsorySchoolMessages.studentAssessmentIntroText)}
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

export default CompulsorySchoolFamilyExamOverview
