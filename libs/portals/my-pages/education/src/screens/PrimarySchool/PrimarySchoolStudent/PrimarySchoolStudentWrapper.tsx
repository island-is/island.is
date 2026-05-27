import { ReactNode } from 'react'
import {
  generatePath,
  useLoaderData,
  useLocation,
  useParams,
} from 'react-router-dom'
import { Hidden, Box } from '@island.is/island-ui/core'
import {
  IntroWrapper,
  m,
  MMS_SLUG,
  TabNavigation,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { EducationPaths } from '../../../lib/paths'
import { primarySchoolMessages as psm } from '../../../lib/messages'
import type { PrimarySchoolStudentLoaderData } from './PrimarySchoolStudent.loader'
import { usePrimarySchoolAssessmentDataQuery } from '../PrimarySchoolAssessment/PrimarySchoolAssessment.generated'

export const PrimarySchoolStudentWrapper = ({
  children,
}: {
  children: ReactNode
}) => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const { studentId } = useParams<{ studentId: string }>()
  const location = useLocation()
  const loaderData = useLoaderData() as PrimarySchoolStudentLoaderData
  const title = loaderData?.studentName ?? psm.schoolLabel

  const { data: assessmentData } = usePrimarySchoolAssessmentDataQuery({
    variables: { studentId: studentId ?? '' },
    skip: !studentId,
  })
  const hasAssessment =
    (assessmentData?.primarySchoolStudent?.assessmentHistory?.length ?? 0) > 0

  const overviewPath = generatePath(EducationPaths.PrimarySchoolOverview, {
    studentId: studentId ?? '',
  })
  const assessmentPath = generatePath(EducationPaths.PrimarySchoolAssessment, {
    studentId: studentId ?? '',
  })

  const tabItems = hasAssessment
    ? [
        {
          name: m.overview,
          path: overviewPath,
          active: location.pathname === overviewPath,
        },
        {
          name: psm.assessmentTitle,
          path: assessmentPath,
          active: location.pathname === assessmentPath,
        },
      ]
    : []

  return (
    <IntroWrapper
      title={title}
      intro={psm.studentHubIntro}
      serviceProvider={{ slug: MMS_SLUG, tooltip: formatMessage(m.mmsTooltip) }}
    >
      {tabItems.length > 0 && (
        <Hidden print>
          <TabNavigation
            label={formatMessage(psm.studentLabel)}
            pathname={location.pathname}
            items={tabItems}
          />
        </Hidden>
      )}
      <Box paddingTop={2}>{children}</Box>
    </IntroWrapper>
  )
}

export default PrimarySchoolStudentWrapper
