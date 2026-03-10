import {
  ActionCard,
  IntroWrapper,
  MMS_SLUG,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Stack } from '@island.is/island-ui/core'
import { generatePath, useParams } from 'react-router-dom'
import { EducationPaths } from '../../lib/paths'
import { primarySchoolMessages as psm } from '../../lib/messages'

export const PrimarySchoolStudent = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const { studentId } = useParams<{ studentId: string }>()

  const id = studentId ?? ''

  return (
    <IntroWrapper
      title={psm.studentListTitle}
      intro={psm.studentHubIntro}
      serviceProviderSlug={MMS_SLUG}
    >
      <Stack space={2}>
        <ActionCard
          eyebrow={formatMessage(psm.mmsEyebrow)}
          heading={formatMessage(psm.hubOverview)}
          text={formatMessage(psm.hubOverviewDescription)}
          cta={{
            label: formatMessage(psm.seeDetails),
            variant: 'text',
            url: generatePath(EducationPaths.PrimarySchoolOverview, {
              studentId: id,
            }),
          }}
        />
        <ActionCard
          eyebrow={formatMessage(psm.mmsEyebrow)}
          heading={formatMessage(psm.hubAssessment)}
          text={formatMessage(psm.hubAssessmentDescription)}
          cta={{
            label: formatMessage(psm.seeDetails),
            variant: 'text',
            url: generatePath(EducationPaths.PrimarySchoolAssessment, {
              studentId: id,
            }),
          }}
        />
        <ActionCard
          eyebrow={formatMessage(psm.mmsEyebrow)}
          heading={formatMessage(psm.hubPermissions)}
          text={formatMessage(psm.hubPermissionsDescription)}
          cta={{
            label: formatMessage(psm.seeDetails),
            variant: 'text',
            url: generatePath(EducationPaths.PrimarySchoolStudentPermission, {
              studentId: id,
            }),
          }}
        />
      </Stack>
    </IntroWrapper>
  )
}

export default PrimarySchoolStudent
