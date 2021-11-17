import React, { ReactNode, useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  FormStepper,
  AlertBanner,
} from '@island.is/island-ui/core'
import { CaseType, UserRole, Case } from '@island.is/judicial-system/types'
import { Sections } from '@island.is/judicial-system-web/src/types'
import { signedVerdictOverview } from '@island.is/judicial-system-web/messages/Core/signedVerdictOverview'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

import { UserContext } from '../UserProvider/UserProvider'
import Logo from '../Logo/Logo'
import Loading from '../Loading/Loading'
import { getSections } from './utils'
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
  const { formatMessage } = useIntl()
  const sections = getSections(
    { dismissedTitle: formatMessage(signedVerdictOverview.dismissedTitle) },
    workingCase,
    activeSubSection,
  )

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
