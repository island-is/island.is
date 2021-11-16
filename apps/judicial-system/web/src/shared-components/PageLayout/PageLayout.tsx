import React, { ReactNode, useContext } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  FormStepper,
  AlertBanner,
} from '@island.is/island-ui/core'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  getCourtSections,
  getCustodyAndTravelBanProsecutorSection,
  getExtenstionSections,
  getInvestigationCaseCourtSections,
  getInvestigationCaseProsecutorSection,
} from '@island.is/judicial-system-web/src/utils/sections'
import {
  CaseDecision,
  CaseType,
  isRestrictionCase,
  isInvestigationCase,
  UserRole,
  Case,
  completedCaseStates,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import { Sections } from '@island.is/judicial-system-web/src/types'
import { UserContext } from '../UserProvider/UserProvider'
import Logo from '../Logo/Logo'
import Loading from '../Loading/Loading'
import * as styles from './PageLayout.css'

import { signedVerdictOverview } from '@island.is/judicial-system-web/messages/Core/signedVerdictOverview'
import { useIntl } from 'react-intl'

interface PageProps {
  children: ReactNode
  workingCase?: Case
  activeSection?: number
  isLoading: boolean
  notFound: boolean
  activeSubSection?: number
  isExtension?: boolean
  showSidepanel?: boolean
}

const PageLayout: React.FC<PageProps> = ({
  workingCase,
  children,
  activeSection,
  activeSubSection,
  isLoading,
  notFound,
  showSidepanel = true,
}) => {
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const caseResult = () => {
    const decisionIsRejecting =
      workingCase?.decision === CaseDecision.REJECTING ||
      workingCase?.parentCase?.decision === CaseDecision.REJECTING

    const decisionIsAccepting =
      isAcceptingCaseDecision(workingCase?.decision) ||
      isAcceptingCaseDecision(workingCase?.parentCase?.decision)

    const decisionIsDismissing =
      workingCase?.decision === CaseDecision.DISMISSING ||
      workingCase?.parentCase?.decision === CaseDecision.DISMISSING

    const decisionIsAcceptingAlternativeTravelBan =
      workingCase?.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
      workingCase?.parentCase?.decision ===
        CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN

    if (decisionIsRejecting) {
      if (isInvestigationCase(workingCase.type)) {
        return 'Kröfu um rannsóknarheimild hafnað'
      } else {
        return 'Kröfu hafnað'
      }
    } else if (decisionIsAccepting) {
      if (isInvestigationCase(workingCase?.type)) {
        return 'Krafa um rannsóknarheimild samþykkt'
      } else {
        return workingCase?.isValidToDateInThePast
          ? `${
              workingCase.type === CaseType.CUSTODY
                ? 'Gæsluvarðhaldi'
                : 'Farbanni'
            } lokið`
          : `${
              workingCase?.type === CaseType.CUSTODY
                ? 'Gæsluvarðhald'
                : 'Farbann'
            } virkt`
      }
    } else if (decisionIsDismissing) {
      return formatMessage(signedVerdictOverview.dismissedTitle)
    } else if (decisionIsAcceptingAlternativeTravelBan) {
      return workingCase.isValidToDateInThePast
        ? 'Farbanni lokið'
        : 'Farbann virkt'
    } else {
      return 'Niðurstaða'
    }
  }

  const sections = [
    isRestrictionCase(workingCase?.type)
      ? getCustodyAndTravelBanProsecutorSection(
          workingCase || ({} as Case),
          activeSubSection,
        )
      : getInvestigationCaseProsecutorSection(
          workingCase || ({} as Case),
          activeSubSection,
        ),
    isRestrictionCase(workingCase?.type)
      ? getCourtSections(workingCase || ({} as Case), activeSubSection)
      : getInvestigationCaseCourtSections(
          workingCase || ({} as Case),
          activeSubSection,
        ),
    {
      name:
        workingCase?.state && completedCaseStates.includes(workingCase?.state)
          ? caseResult()
          : 'Niðurstaða',
    },
    getExtenstionSections(workingCase || ({} as Case), activeSubSection),
    getCourtSections(workingCase || ({} as Case), activeSubSection),
  ]

  return children ? (
    <Box
      paddingY={[3, 3, 3, 6]}
      background="purple100"
      className={styles.processContainer}
    >
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '9/12', '9/12']}>
            <Box
              background="white"
              borderColor="white"
              borderRadius="large"
              className={styles.processContent}
            >
              {children}
            </Box>
          </GridColumn>
          {showSidepanel && (
            <GridColumn span={['0', '0', '3/12', '3/12']}>
              <div className={styles.formStepperContainer}>
                <Box marginLeft={2}>
                  <Box marginBottom={5}>
                    <Logo />
                  </Box>
                  <FormStepper
                    // Remove the extension parts of the formstepper if the user is not applying for an extension
                    sections={
                      activeSection === Sections.EXTENSION ||
                      activeSection === Sections.JUDGE_EXTENSION
                        ? sections
                        : sections.filter((_, index) => index <= 2)
                    }
                    formName={
                      workingCase?.type === CaseType.CUSTODY
                        ? 'Gæsluvarðhald'
                        : workingCase?.type === CaseType.TRAVEL_BAN
                        ? 'Farbann'
                        : 'Rannsóknarheimild'
                    }
                    activeSection={activeSection}
                    activeSubSection={activeSubSection}
                  />
                </Box>
              </div>
            </GridColumn>
          )}
        </GridRow>
      </GridContainer>
    </Box>
  ) : isLoading ? (
    <Box className={styles.loadingWrapper}>
      <Loading />
    </Box>
  ) : notFound ? (
    <AlertBanner
      title={
        user?.role === UserRole.ADMIN
          ? 'Notandi fannst ekki'
          : 'Mál fannst ekki'
      }
      description={
        user?.role === UserRole.ADMIN
          ? 'Vinsamlegast reynið aftur með því að opna notandann aftur frá yfirlitssíðunni'
          : 'Vinsamlegast reynið aftur með því að opna málið aftur frá yfirlitssíðunni'
      }
      variant="error"
      link={{
        href:
          user?.role === UserRole.ADMIN
            ? Constants.USER_LIST_ROUTE
            : Constants.REQUEST_LIST_ROUTE,
        title: 'Fara á yfirlitssíðu',
      }}
    />
  ) : null
}

export default PageLayout
