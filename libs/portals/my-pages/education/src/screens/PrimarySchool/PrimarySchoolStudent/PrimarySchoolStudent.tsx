import { IntroWrapperV2, m, MMS_SLUG } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionCard, Stack } from '@island.is/island-ui/core'
import {
  generatePath,
  useLoaderData,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { EducationPaths } from '../../../lib/paths'
import { primarySchoolMessages as psm } from '../../../lib/messages'
import type { PrimarySchoolStudentLoaderData } from './PrimarySchoolStudent.loader'

export const PrimarySchoolStudent = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { studentId } = useParams<{ studentId: string }>()
  const loaderData = useLoaderData() as PrimarySchoolStudentLoaderData

  const id = studentId ?? ''
  const title = loaderData?.studentName ?? psm.studentListTitle

  return (
    <IntroWrapperV2
      title={title}
      intro={psm.studentHubIntro}
      serviceProvider={{
        slug: MMS_SLUG,
        tooltip: formatMessage(m.mmsTooltip),
      }}
    >
      <Stack space={2}>
        <ActionCard
          eyebrow={formatMessage(psm.mmsEyebrow)}
          eyebrowColor="purple400"
          heading={formatMessage(psm.hubOverview)}
          headingVariant="h4"
          text={formatMessage(psm.hubOverviewDescription)}
          cta={{
            label: formatMessage(psm.seeDetails),
            variant: 'text',
            onClick: () =>
              navigate(
                generatePath(EducationPaths.PrimarySchoolOverview, {
                  studentId: id,
                }),
              ),
          }}
        />
        <ActionCard
          eyebrow={formatMessage(psm.mmsEyebrow)}
          eyebrowColor="purple400"
          heading={formatMessage(psm.hubAssessment)}
          headingVariant="h4"
          text={formatMessage(psm.hubAssessmentDescription)}
          cta={{
            label: formatMessage(psm.seeDetails),
            variant: 'text',
            onClick: () =>
              navigate(
                generatePath(EducationPaths.PrimarySchoolAssessment, {
                  studentId: id,
                }),
              ),
          }}
        />
        {/*<ActionCard
          eyebrow={formatMessage(psm.mmsEyebrow)}
          eyebrowColor="purple400"
          heading={formatMessage(psm.hubPermissions)}
          text={formatMessage(psm.hubPermissionsDescription)}
          cta={{
            label: formatMessage(psm.seeDetails),
            variant: 'text',
            onClick: () =>
              navigate(
                generatePath(EducationPaths.PrimarySchoolStudentPermission, {
                  studentId: id,
                }),
              ),
          }}
        />*/}
      </Stack>
    </IntroWrapperV2>
  )
}

export default PrimarySchoolStudent
