import React, { ReactNode, FC, useContext } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  FormStepper,
  AlertBanner,
  LinkContext,
} from '@island.is/island-ui/core'
import * as styles from './PageLayout.treat'
import {
  JudgeLogo,
  ProsecutorLogo,
} from '@island.is/judicial-system-web/src/shared-components/Logos'
import { Loading } from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { CaseDecision, UserRole } from '@island.is/judicial-system/types'
import { Link } from 'react-router-dom'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { Sections } from '@island.is/judicial-system-web/src/types'

interface PageProps {
  children: ReactNode
  activeSection: number
  isLoading: boolean
  notFound: boolean
  activeSubSection?: number
  decision?: CaseDecision
  parentCaseDecision?: CaseDecision
  isCustodyEndDateInThePast?: boolean
  isExtension?: boolean
}

const PageLayout: FC<PageProps> = ({
  children,
  activeSection,
  activeSubSection,
  isLoading,
  notFound,
  decision,
  parentCaseDecision,
  isCustodyEndDateInThePast,
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
      name: 'Krafa um gæsluvarðhald',
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
              paddingY={[0, 0, 10, 10]}
              background="white"
              borderColor="white"
              borderRadius="large"
              className={styles.processContent}
            >
              <GridColumn
                span={['9/9', '9/9', '7/9', '7/9']}
                offset={['0', '0', '1/9', '1/9']}
              >
                {children}
              </GridColumn>
            </Box>
          </GridColumn>
          <GridColumn span={['0', '0', '3/12', '3/12']}>
            <Box marginLeft={2}>
              {user?.role === UserRole.JUDGE ? (
                <Box marginBottom={7}>
                  <JudgeLogo />
                </Box>
              ) : user?.role === UserRole.PROSECUTOR ? (
                <Box marginBottom={7}>
                  <ProsecutorLogo />
                </Box>
              ) : null}
              <FormStepper
                // Remove the extension parts of the formstepper if the user is not applying for an extension
                sections={
                  activeSection === Sections.EXTENSION ||
                  activeSection === Sections.JUDGE_EXTENSION
                    ? sections
                    : sections.filter((_, index) => index <= 2)
                }
                formName="Gæsluvarðhald"
                activeSection={activeSection}
                activeSubSection={activeSubSection}
              />
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  ) : isLoading ? (
    <Box className={styles.loadingWrapper}>
      <Loading />
    </Box>
  ) : (
    <LinkContext.Provider
      value={{
        linkRenderer: (href, children) => (
          <Link to={href} color="blue400" className={styles.link}>
            {children}
          </Link>
        ),
      }}
    >
      {notFound && (
        <AlertBanner
          title="Mál fannst ekki"
          description="Vinsamlegast reynið aftur með því að opna málið aftur frá yfirlitssíðunni"
          variant="error"
          link={{
            href: Constants.DETENTION_REQUESTS_ROUTE,
            title: 'Fara á yfirlitssíðu',
          }}
        />
      )}
    </LinkContext.Provider>
  )
}

export default PageLayout
