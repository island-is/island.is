import React, { ReactNode, FC, useContext } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  FormStepper,
} from '@island.is/island-ui/core'
import { userContext } from '../../utils/userContext'
import * as styles from './PageLayout.treat'
import { JudgeLogo, ProsecutorLogo } from '../Logos'
import { UserRole } from '@island.is/judicial-system/types'

interface PageProps {
  children: ReactNode
  activeSection: number
  activeSubSection: number
}

export const PageLayout: FC<PageProps> = ({
  children,
  activeSection,
  activeSubSection,
}) => {
  const uContext = useContext(userContext)

  return (
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
              {uContext.user?.role === UserRole.JUDGE ? (
                <Box marginBottom={7}>
                  <JudgeLogo />
                </Box>
              ) : uContext.user?.role === UserRole.PROSECUTOR ? (
                <Box marginBottom={7}>
                  <ProsecutorLogo />
                </Box>
              ) : null}
              <FormStepper
                sections={[
                  {
                    name: 'Krafa um gæsluvarðhald',
                    children: [
                      { type: 'SUB_SECTION', name: 'Grunnupplýsingar' },
                      { type: 'SUB_SECTION', name: 'Málsatvik og lagarök' },
                      { type: 'SUB_SECTION', name: 'Yfirlit kröfu' },
                    ],
                  },
                  {
                    name: 'Úrskurður Héraðsdóms',
                    children: [
                      { type: 'SUB_SECTION', name: 'Yfirlit kröfu' },
                      { type: 'SUB_SECTION', name: 'Þingbók' },
                      { type: 'SUB_SECTION', name: 'Úrskurður' },
                      { type: 'SUB_SECTION', name: 'Úrskurðarorð' },
                      { type: 'SUB_SECTION', name: 'Yfirlit úrskurðar' },
                    ],
                  },
                ]}
                formName="Gæsluvarðhald"
                activeSection={activeSection}
                activeSubSection={activeSubSection}
              />
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}
