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

interface PageProps {
  children: ReactNode
  activeSection?: number
  isLoading: boolean
  notFound: boolean
  caseType?: CaseType
  activeSubSection?: number
  decision?: CaseDecision
  parentCaseDecision?: CaseDecision
  isCustodyEndDateInThePast?: boolean
  isExtension?: boolean
  showSidepanel?: boolean
}

const PageLayout: React.FC<PageProps> = ({
  children,
  activeSection,
  activeSubSection,
  isLoading,
  notFound,
  caseType,
  decision,
  parentCaseDecision,
  isCustodyEndDateInThePast,
  showSidepanel = true,
}) => {
  const { user } = useContext(UserContext)

  const caseResult = () => {
    if (
      decision === CaseDecision.REJECTING ||
      parentCaseDecision === CaseDecision.REJECTING
    ) {
      return 'Kröfu hafnað'
    } else if (
      decision === CaseDecision.ACCEPTING ||
      parentCaseDecision === CaseDecision.ACCEPTING
    ) {
      return isCustodyEndDateInThePast
        ? 'Gæsluvarðhaldi lokið'
        : 'Gæsluvarðhald virkt'
    } else if (
      decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
      parentCaseDecision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
    ) {
      return isCustodyEndDateInThePast ? 'Farbanni lokið' : 'Farbann virkt'
    } else {
      return 'Niðurstaða'
    }
  }

  const sections = [
    {
      name:
        caseType === CaseType.CUSTODY
          ? 'Krafa um gæsluvarðhald'
          : 'Krafa um farbann',
      children: [
        { type: 'SUB_SECTION', name: 'Sakborningur' },
        { type: 'SUB_SECTION', name: 'Óskir um fyrirtöku' },
        {
          type: 'SUB_SECTION',
          name: 'Dómkröfur og lagagrundvöllur',
        },
        {
          type: 'SUB_SECTION',
          name: 'Greinargerð',
        },
        {
          type: 'SUB_SECTION',
          name: 'Rannsóknargögn',
        },
        {
          type: 'SUB_SECTION',
          name: 'Yfirlit kröfu',
        },
      ],
    },
    {
      name: 'Úrskurður Héraðsdóms',
      children: [
        { type: 'SUB_SECTION', name: 'Yfirlit kröfu' },
        { type: 'SUB_SECTION', name: 'Fyrirtökutími' },
        { type: 'SUB_SECTION', name: 'Þingbók' },
        { type: 'SUB_SECTION', name: 'Úrskurður' },
        { type: 'SUB_SECTION', name: 'Úrskurðarorð' },
        { type: 'SUB_SECTION', name: 'Yfirlit úrskurðar' },
      ],
    },
    {
      name: caseResult(),
    },
    {
      name: 'Krafa um framlengingu',
      children: [
        { type: 'SUB_SECTION', name: 'Sakborningur' },
        { type: 'SUB_SECTION', name: 'Óskir um fyrirtöku' },
        {
          type: 'SUB_SECTION',
          name: 'Dómkröfur og lagagrundvöllur',
        },
        {
          type: 'SUB_SECTION',
          name: 'Greinargerð',
        },
        {
          type: 'SUB_SECTION',
          name: 'Rannsóknargögn',
        },
        {
          type: 'SUB_SECTION',
          name: 'Yfirlit kröfu',
        },
      ],
    },
    {
      name: 'Úrskurður Héraðsdóms',
      children: [
        { type: 'SUB_SECTION', name: 'Yfirlit kröfu' },
        { type: 'SUB_SECTION', name: 'Fyrirtökutími' },
        { type: 'SUB_SECTION', name: 'Þingbók' },
        { type: 'SUB_SECTION', name: 'Úrskurður' },
        { type: 'SUB_SECTION', name: 'Úrskurðarorð' },
        { type: 'SUB_SECTION', name: 'Yfirlit úrskurðar' },
      ],
    },
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
              <Box marginLeft={2}>
                <Logo />
                <FormStepper
                  // Remove the extension parts of the formstepper if the user is not applying for an extension
                  sections={
                    activeSection === Sections.EXTENSION ||
                    activeSection === Sections.JUDGE_EXTENSION
                      ? sections
                      : sections.filter((_, index) => index <= 2)
                  }
                  formName={
                    caseType === CaseType.CUSTODY ? 'Gæsluvarðhald' : 'Farbann'
                  }
                  activeSection={activeSection}
                  activeSubSection={activeSubSection}
                />
              </Box>
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
