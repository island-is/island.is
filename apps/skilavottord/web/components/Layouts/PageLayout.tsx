import React, { ReactNode, FC } from 'react'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Footer,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import FormStepperMobile from '../FormStepper/FormStepperMobile'
import FormStepper from '../FormStepper/FormStepper'

interface PageProps {
  children: ReactNode
}

interface ProcessPageProps extends PageProps {
  activeSection: number
  activeCar: string
}

export const PageLayout: FC<PageProps> = ({ children }) => (
  <Box>
    <Box paddingY={10}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '7/12', '7/12']}>
            <Box>{children}</Box>
          </GridColumn>
          <GridColumn
            span={['0', '0', '3/12', '3/12']}
            offset={['0', '0', '1/12', '1/12']}
          ></GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
    <Footer />
  </Box>
)

export const ProcessPageLayout: FC<ProcessPageProps> = ({
  children,
  activeSection,
  activeCar,
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const {
    t: { processSections: t },
  } = useI18n()

  const sections = t.map((section) => {
    return { name: section }
  })

  return (
    <Box
      paddingY={[0, 0, 10, 10]}
      background={isMobile ? 'white' : 'purple100'}
    >
      {isMobile && (
        <FormStepperMobile sections={sections} activeSection={activeSection} />
      )}
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '9/12', '9/12']}>
            <Box
              paddingY={[3, 3, 3, 6]}
              background="white"
              borderColor="white"
              borderRadius="large"
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
            {!isMobile && (
              <FormStepper
                sections={sections}
                activeSection={activeSection}
                activeCar={activeCar}
              />
            )}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}
