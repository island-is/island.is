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
  CaseDecision,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'
import { Sections } from '@island.is/judicial-system-web/src/types'
import { UserContext } from '../UserProvider/UserProvider'
import Logo from '../Logo/Logo'
import Loading from '../Loading/Loading'
import * as styles from './PageLayout.treat'
import {
  getCourtSections,
  getCustodyAndTravelBanProsecutorSection,
  getExtenstionSections,
  getInvestigationCaseCourtSections,
  getInvestigationCaseProsecutorSection,
} from './Sections'

interface PageProps {
  children: ReactNode
  caseId?: string
  activeSection?: number
  isLoading: boolean
  notFound: boolean
  caseType?: CaseType
  activeSubSection?: number
  decision?: CaseDecision
  parentCaseDecision?: CaseDecision
  isValidToDateInThePast?: boolean
  isExtension?: boolean
  showSidepanel?: boolean
}

const PageLayout: React.FC<PageProps> = ({
  children,
  caseId,
  activeSection,
  activeSubSection,
  isLoading,
  notFound,
  caseType,
  decision,
  parentCaseDecision,
  isValidToDateInThePast,
  showSidepanel = true,
}) => {
  const { user } = useContext(UserContext)

  const caseResult = () => {
    const decisionIsRejecting =
      decision === CaseDecision.REJECTING ||
      parentCaseDecision === CaseDecision.REJECTING

    const decisionIsAccepting =
      decision === CaseDecision.ACCEPTING ||
      parentCaseDecision === CaseDecision.ACCEPTING

    const decisionIsAcceptingAlternativeTravelBan =
      decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
      parentCaseDecision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN

    const isInvestigationCase =
      caseType !== CaseType.CUSTODY && caseType !== CaseType.TRAVEL_BAN

    if (decisionIsRejecting) {
      if (isInvestigationCase) {
        return 'Kröfu um rannsóknarheimild hafnað'
      } else {
        return 'Kröfu hafnað'
      }
    } else if (decisionIsAccepting) {
      if (isInvestigationCase) {
        return 'Krafa um rannsóknarheimild samþykkt'
      } else {
        return isValidToDateInThePast
          ? `${
              caseType === CaseType.CUSTODY ? 'Gæsluvarðhaldi' : 'Farbanni'
            } lokið`
          : `${
              caseType === CaseType.CUSTODY ? 'Gæsluvarðhald' : 'Farbann'
            } virkt`
      }
    } else if (decisionIsAcceptingAlternativeTravelBan) {
      return isValidToDateInThePast ? 'Farbanni lokið' : 'Farbann virkt'
    } else {
      return 'Niðurstaða'
    }
  }

  const sections = [
    caseType === CaseType.CUSTODY || caseType === CaseType.TRAVEL_BAN
      ? getCustodyAndTravelBanProsecutorSection(
          caseId,
          caseType,
          activeSubSection,
        )
      : getInvestigationCaseProsecutorSection(caseId, activeSubSection),
    caseType === CaseType.CUSTODY || caseType === CaseType.TRAVEL_BAN
      ? getCourtSections(caseId, activeSubSection)
      : getInvestigationCaseCourtSections(caseId, activeSubSection),
    {
      name: caseResult(),
    },
    getExtenstionSections(caseId, activeSubSection),
    getCourtSections(caseId, activeSubSection),
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
                      caseType === CaseType.CUSTODY
                        ? 'Gæsluvarðhald'
                        : caseType === CaseType.TRAVEL_BAN
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
