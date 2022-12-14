import React, { ReactNode, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'

import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  FormStepperV2,
  AlertBanner,
  Section,
  linkStyles,
  Text,
  Link,
} from '@island.is/island-ui/core'
import {
  UserRole,
  Case,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import { Sections } from '@island.is/judicial-system-web/src/types'
import {
  sections as formStepperSections,
  pageLayout,
} from '@island.is/judicial-system-web/messages'
import * as constants from '@island.is/judicial-system/consts'

import { UserContext } from '../UserProvider/UserProvider'
import Logo from '../Logo/Logo'
import Skeleton from '../Skeleton/Skeleton'
import useSections from '../../utils/hooks/useSections'
import * as styles from './PageLayout.css'

interface PageProps {
  children: ReactNode
  workingCase?: Case
  activeSection?: number
  isLoading: boolean
  notFound: boolean
  isExtension?: boolean
  showSidepanel?: boolean
  // These props are optional because not all pages need them, f.x. SignedVerdictOverview page
  activeSubSection?: number
  onNavigationTo?: (destination: string) => Promise<unknown>
  isValid?: boolean
}

export interface RouteSection {
  name: string
  children: {
    name: string
    href?: string
    onClick?: () => void
  }[]
}

const RenderSubsectionChild: React.FC<{
  isActive: boolean
}> = ({ isActive, children }) => (
  <Box className={styles.name}>
    <Text as="div" lineHeight="lg" fontWeight={isActive ? 'semiBold' : 'light'}>
      {children}
    </Text>
  </Box>
)

const PageLayout: React.FC<PageProps> = ({
  workingCase,
  children,
  activeSection,
  activeSubSection,
  isLoading,
  notFound,
  showSidepanel = true,
  onNavigationTo,
  isValid,
}) => {
  const { user } = useContext(UserContext)
  const { getSections } = useSections(isValid, onNavigationTo)
  const { formatMessage } = useIntl()
  // Remove the extension parts of the formstepper if the user is not applying for an extension
  const sections =
    activeSection === Sections.EXTENSION ||
    activeSection === Sections.JUDGE_EXTENSION
      ? getSections(workingCase, user)
      : getSections(workingCase, user).filter((_, index) => index <= 2)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const renderSections = (sections: RouteSection[]) =>
    sections.map((section, index) => (
      <Section
        section={section.name}
        sectionIndex={index}
        isActive={index === activeSection}
        isComplete={activeSection ? index < activeSection : false}
        subSections={section.children.map((subSection, index) =>
          subSection.href && activeSubSection && activeSubSection > index ? (
            <Link href={subSection.href} underline="small">
              <RenderSubsectionChild isActive={index === activeSubSection}>
                {subSection.name}
              </RenderSubsectionChild>
            </Link>
          ) : subSection.onClick ? (
            <Box
              component="button"
              onClick={subSection.onClick}
              className={cn(
                linkStyles.underlineVisibilities['hover'],
                linkStyles.underlines['small'],
              )}
            >
              <RenderSubsectionChild isActive={index === activeSubSection}>
                {subSection.name}
              </RenderSubsectionChild>
            </Box>
          ) : (
            <RenderSubsectionChild isActive={index === activeSubSection}>
              {subSection.name}
            </RenderSubsectionChild>
          ),
        )}
      />
    ))

  return isLoading ? (
    <Skeleton />
  ) : notFound ? (
    <AlertBanner
      title={
        user?.role === UserRole.ADMIN
          ? formatMessage(pageLayout.adminRole.alertTitle)
          : user?.role === UserRole.DEFENDER
          ? formatMessage(pageLayout.defenderRole.alertTitle)
          : formatMessage(pageLayout.otherRoles.alertTitle)
      }
      description={
        user?.role === UserRole.ADMIN
          ? formatMessage(pageLayout.adminRole.alertMessage)
          : user?.role === UserRole.DEFENDER
          ? formatMessage(pageLayout.defenderRole.alertMessage)
          : formatMessage(pageLayout.otherRoles.alertMessage)
      }
      variant="error"
      link={
        user?.role === UserRole.DEFENDER
          ? undefined
          : {
              href:
                user?.role === UserRole.ADMIN
                  ? constants.USERS_ROUTE
                  : constants.CASES_ROUTE,
              title: 'Fara á yfirlitssíðu',
            }
      }
    />
  ) : children ? (
    <Box
      paddingY={[0, 0, 3, 6]}
      paddingX={[0, 0, 4]}
      background="purple100"
      className={styles.processContainer}
    >
      <GridContainer className={styles.container}>
        <GridRow direction={['columnReverse', 'columnReverse', 'row']}>
          <GridColumn span={['12/12', '12/12', '8/12', '8/12']}>
            <Box
              background="white"
              borderColor="white"
              paddingTop={[3, 3, 10, 10]}
              className={styles.processContent}
            >
              {children}
            </Box>
          </GridColumn>
          {showSidepanel && (
            <GridColumn span={['12/12', '12/12', '4/12', '3/12']}>
              <div className={styles.formStepperContainer}>
                <Box marginLeft={[0, 0, 2]}>
                  <Box marginBottom={7} display={['none', 'none', 'block']}>
                    <Logo defaultInstitution={workingCase?.court?.name} />
                  </Box>
                  <Box marginBottom={6}>
                    <Text variant="h3" as="h3">
                      {formatMessage(
                        isIndictmentCase(workingCase?.type)
                          ? formStepperSections.indictmentTitle
                          : formStepperSections.title,
                        { caseType: workingCase?.type },
                      )}
                    </Text>
                  </Box>
                  <FormStepperV2 sections={renderSections(sections)} />
                </Box>
              </div>
            </GridColumn>
          )}
        </GridRow>
      </GridContainer>
    </Box>
  ) : null
}

export default PageLayout
