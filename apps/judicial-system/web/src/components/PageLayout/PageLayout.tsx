import React, { ReactNode, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  FormStepper,
  AlertBanner,
} from '@island.is/island-ui/core'
import {
  UserRole,
  Case,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import { Sections } from '@island.is/judicial-system-web/src/types'
import * as constants from '@island.is/judicial-system/consts'
import { sections, pageLayout } from '@island.is/judicial-system-web/messages'

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
  const { getSections } = useSections()
  const { formatMessage } = useIntl()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
                  <FormStepper
                    // Remove the extension parts of the formstepper if the user is not applying for an extension
                    sections={
                      activeSection === Sections.EXTENSION ||
                      activeSection === Sections.JUDGE_EXTENSION
                        ? getSections(workingCase, activeSubSection, user)
                        : getSections(
                            workingCase,
                            activeSubSection,
                            user,
                          ).filter((_, index) => index <= 2)
                    }
                    formName={formatMessage(
                      isIndictmentCase(workingCase?.type)
                        ? sections.indictmentTitle
                        : sections.title,
                      { caseType: workingCase?.type },
                    )}
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
  ) : null
}

export default PageLayout
