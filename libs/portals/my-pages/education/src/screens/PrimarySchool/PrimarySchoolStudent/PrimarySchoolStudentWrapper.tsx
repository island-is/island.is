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
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { EducationPaths } from '../../../lib/paths'
import { primarySchoolMessages as psm } from '../../../lib/messages'
import type { PrimarySchoolStudentLoaderData } from './PrimarySchoolStudent.loader'
import { usePrimarySchoolAssessmentDataQuery } from '../PrimarySchoolAssessment/PrimarySchoolAssessment.generated'
import { usePrimarySchoolStudentHasKeyInfoQuery } from '../PrimarySchoolOverview/keyInfo/PrimarySchoolKeyInfo.generated'

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
  const title = titleOverride ?? studentName

  const { data: assessmentData, loading: assessmentLoading } =
    usePrimarySchoolAssessmentDataQuery({
      variables: { studentId: studentId ?? '' },
      skip: !studentId || hideTabs,
    })
  const hasAssessment =
    (assessmentData?.primarySchoolStudent?.assessmentHistory?.length ?? 0) > 0

  // Key information sits behind its own flag, separate from the one gating the
  // primary-school page, so it can stay dark after the assessment screens go
  // live. While it is off the frigg read is never made.
  const { value: keyInfoEnabled, loading: keyInfoFlagLoading } = useFeatureFlag(
    Features.isServicePortalPrimarySchoolKeyInfoEnabled,
    false,
  )

  const {
    data: keyInfoData,
    loading: keyInfoLoading,
    error: keyInfoError,
  } = usePrimarySchoolStudentHasKeyInfoQuery({
    variables: { studentId: studentId ?? '' },
    skip: !studentId || hideTabs || !keyInfoEnabled,
  })
  const hasKeyInfoChild =
    keyInfoEnabled && (keyInfoData?.primarySchoolStudent?.hasKeyInfo ?? false)

  // Show the student hub only when there is something to show: the child exists
  // in the frigg key-info database, or has assessment history. Either answer on
  // its own is enough to have content, but the assessment query is also what
  // decides whether there is a tab bar — so the hub waits for that one answer
  // rather than rendering the page and dropping a tab bar in above it a moment
  // later. It does not wait on the frigg round trip: a student with assessment
  // history gets its tabs without it.
  const hasContent = (hasAssessment || hasKeyInfoChild) && !assessmentLoading
  const stillChecking =
    assessmentLoading || keyInfoLoading || keyInfoFlagLoading

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
      ) : stillChecking ? (
        <CardLoader />
      ) : keyInfoError ? (
        // A child whose only content is key information looks exactly like a
        // child with nothing to show once the frigg read fails, so the failure
        // is reported rather than answered with "no data".
        <Problem error={keyInfoError} noBorder={false} />
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
