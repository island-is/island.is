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
import { usePrimarySchoolChildrenQuery } from '../PrimarySchoolOverview/keyInfo/PrimarySchoolKeyInfo.generated'

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
  const studentName = loaderData?.studentName ?? psm.schoolLabel
  const nationalId = loaderData?.nationalId ?? undefined
  const title = titleOverride ?? studentName

  const { data: assessmentData, loading: assessmentLoading } =
    usePrimarySchoolAssessmentDataQuery({
      variables: { studentId: studentId ?? '' },
      skip: !studentId || hideTabs,
    })
  const hasAssessment =
    (assessmentData?.primarySchoolStudent?.assessmentHistory?.length ?? 0) > 0

  // The key-info (frigg) backend keys children on a different id than the one we
  // route on, so match the routed student to a frigg child by national id.
  const { data: childrenData, loading: childrenLoading } =
    usePrimarySchoolChildrenQuery({ skip: !studentId || hideTabs })
  const hasKeyInfoChild = nationalId
    ? (childrenData?.primarySchoolChildren ?? []).some(
        (child) => child.nationalId === nationalId,
      )
    : false

  // Show the student hub only when there is something to show: the child exists
  // in the frigg key-info database, or has assessment history.
  const checking = assessmentLoading || childrenLoading
  const hasContent = hasKeyInfoChild || hasAssessment

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
      ) : checking ? (
        <CardLoader />
      ) : hasContent ? (
        <>
          {/* The assessment tab only exists when the student has assessment
              history; the overview (key information) shows whenever the child
              exists in the frigg key-info database. */}
          {hasAssessment && (
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
          )}
          <Box paddingTop={hasAssessment ? 2 : 0}>{children}</Box>
        </>
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
