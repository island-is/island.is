import React, { ReactNode, FC, useState, useEffect } from 'react'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  ToastContainer,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import {
  Footer,
  FormStepper,
  FormStepperMobile,
  LinkProvider,
} from '@island.is/skilavottord-web/components'
import * as styles from './PageLayout.css'

interface PageProps {
  children: ReactNode
}

export const PageLayout: FC<React.PropsWithChildren<PageProps>> = ({
  children,
}) => (
  <Box>
    <LinkProvider>
      <Box paddingY={[3, 3, 10, 10]}>
        <GridContainer>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '12/12', '10/12']}
              offset={['0', '0', '1/12', '1/12']}
            >
              <Box paddingBottom={10}>{children}</Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </LinkProvider>
    <Footer />
  </Box>
)

interface ProcessPageProps extends PageProps {
  activeSection: number
  processType: 'citizen' | 'company'
  activeCar?: string
}

export const ProcessPageLayout: FC<
  React.PropsWithChildren<ProcessPageProps>
> = ({ children, processType = 'citizen', activeSection, activeCar }) => {
  const { width } = useWindowSize()

  const {
    t: { processes: t },
  } = useI18n()

  const sections = t[processType].sections.map((section) => {
    return { name: section }
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return (
    <LinkProvider>
      <Box
        paddingY={[0, 0, 10, 10]}
        background={isMobile ? 'white' : 'purple100'}
        className={styles.processContainer}
      >
        {isMobile && (
          <FormStepperMobile
            sections={sections}
            activeSection={activeSection}
          />
        )}
        <GridContainer>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '9/12', '9/12']}>
              <Box
                paddingY={[3, 3, 6, 6]}
                background="white"
                borderColor="white"
                borderRadius="large"
                className={styles.processContent}
              >
                <GridColumn
                  span={['9/9', '9/9', '10/12', '7/9']}
                  offset={['0', '0', '1/12', '1/9']}
                >
                  {children}
                </GridColumn>
              </Box>
            </GridColumn>
            <GridColumn span={['0', '0', '3/12', '3/12']}>
              {!isMobile && (
                <FormStepper
                  title={t[processType].title}
                  completedText={t.citizen.completed}
                  sections={sections}
                  activeSection={activeSection}
                  activeCar={activeCar}
                />
              )}
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </LinkProvider>
  )
}

interface PartnerPageProps {
  children: ReactNode
  side: ReactNode
}

export const PartnerPageLayout: FC<
  React.PropsWithChildren<PartnerPageProps>
> = ({ children, side }) => (
  <Box>
    <ToastContainer />
    <LinkProvider>
      <Box paddingY={[5, 5, 10, 10]}>
        <GridContainer>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '4/12', '3/12']}>
              {side}
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '8/12', '9/12']}>
              <Box paddingY={[5, 5, 3, 3]}>{children}</Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </LinkProvider>
    <Footer />
  </Box>
)

export const FormPageLayout: FC<React.PropsWithChildren<PageProps>> = ({
  children,
}) => (
  <Box>
    <LinkProvider>
      <Box paddingY={10}>
        <GridContainer>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '9/12', '9/12']}>
              {children}
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </LinkProvider>
    <Footer />
  </Box>
)
