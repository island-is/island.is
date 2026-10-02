import { ReactNode } from 'react'
import type { MessageDescriptor } from 'react-intl'
import {
  generatePath,
  useLoaderData,
  useLocation,
  useParams,
} from 'react-router-dom'
import { Hidden, Box } from '@island.is/island-ui/core'
import {
  CardLoader,
  IntroWrapper,
  m,
  MMS_SLUG,
  TabNavigation,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { EducationPaths } from '../../../lib/paths'
import { primarySchoolMessages as psm } from '../../../lib/messages'
import type { PrimarySchoolStudentLoaderData } from './PrimarySchoolStudent.loader'
import { usePrimarySchoolAssessmentDataQuery } from '../PrimarySchoolAssessment/PrimarySchoolAssessment.generated'
import {
  USE_MOCK_KEY_INFO,
  mockStudent,
} from '../PrimarySchoolOverview/keyInfo/mockData'

export const PrimarySchoolStudentWrapper = ({
  children,
  hideTabs = false,
  intro = psm.studentHubIntro,
  title: titleOverride,
}: {
  children: ReactNode
  hideTabs?: boolean
  intro?: MessageDescriptor
  /** Override the H1; defaults to the student's name. */
  title?: MessageDescriptor | string
}) => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const { studentId } = useParams<{ studentId: string }>()
  const location = useLocation()
  const loaderData = useLoaderData() as PrimarySchoolStudentLoaderData
  const studentName = USE_MOCK_KEY_INFO
    ? mockStudent.name ?? psm.schoolLabel
    : loaderData?.studentName ?? psm.schoolLabel
  const title = titleOverride ?? studentName

  const { data: assessmentData, loading: assessmentLoading } =
    usePrimarySchoolAssessmentDataQuery({
      variables: { studentId: studentId ?? '' },
      skip: !studentId || USE_MOCK_KEY_INFO || hideTabs,
    })
  // DEV-ONLY: force the tab/children to render even without assessment data.
  const hasAssessment =
    USE_MOCK_KEY_INFO ||
    (assessmentData?.primarySchoolStudent?.assessmentHistory?.length ?? 0) > 0

  const overviewPath = generatePath(EducationPaths.PrimarySchoolOverview, {
    studentId: studentId ?? '',
  })
  const assessmentPath = generatePath(EducationPaths.PrimarySchoolAssessment, {
    studentId: studentId ?? '',
  })

  return (
    <IntroWrapper
      title={title}
      intro={intro}
      marginBottom={hideTabs ? 0 : undefined}
      serviceProvider={{ slug: MMS_SLUG, tooltip: formatMessage(m.mmsTooltip) }}
    >
      {hideTabs ? (
        children
      ) : hasAssessment ? (
        <>
          <Hidden print>
            <TabNavigation
              label={formatMessage(m.menu)}
              pathname={location.pathname}
              items={[
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
              ]}
            />
          </Hidden>
          <Box paddingTop={2}>{children}</Box>
        </>
      ) : assessmentLoading ? (
        <CardLoader />
      ) : (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(psm.assessmentNoData)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
    </IntroWrapper>
  )
}

export default PrimarySchoolStudentWrapper
