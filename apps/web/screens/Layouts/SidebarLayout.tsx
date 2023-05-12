import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import cn from 'classnames'

import * as styles from './SidebarLayout.css'

const Container = ({ fullWidth = false, children }) => {
  if (fullWidth) return <Box>{children}</Box>
  return <GridContainer position="none">{children}</GridContainer>
}

interface SidebarLayoutProps {
  sidebarContent: ReactNode
  isSticky?: boolean
  hiddenOnTablet?: boolean
  fullWidthContent?: boolean
  paddingTop?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
  contentId?: string
  fullWidthContainer?: boolean
}

export const SidebarLayout: FC<SidebarLayoutProps> = ({
  sidebarContent,
  isSticky = true,
  hiddenOnTablet = false,
  fullWidthContent = false,
  paddingTop = [0, 0, 8],
  paddingBottom = 6,
  contentId,
  fullWidthContainer = false,
  children,
}) => {
  return (
    <Box paddingTop={paddingTop}>
      <Container fullWidth={fullWidthContainer}>
        <Box
          {...(contentId && { id: contentId })}
          display="flex"
          flexDirection="row"
          height="full"
          paddingBottom={paddingBottom}
          position={isSticky ? 'relative' : undefined}
        >
          <Box
            printHidden
            className={cn(styles.sidebarWrapper, { [styles.sticky]: isSticky })}
            marginLeft={fullWidthContainer ? [0, 0, 6, 8, 12] : 0}
            display={
              hiddenOnTablet
                ? ['none', 'none', 'none', 'block']
                : ['none', 'none', 'block']
            }
          >
            {sidebarContent}
          </Box>
          <GridContainer>
            <GridRow>
              <GridColumn
                offset={fullWidthContent ? '0' : ['0', '0', '0', '0', '1/9']}
                span={[
                  '9/9',
                  '9/9',
                  '9/9',
                  '9/9',
                  fullWidthContent ? '9/9' : '7/9',
                ]}
              >
                <Box paddingLeft={[0, 0, hiddenOnTablet ? 0 : 6, 6, 0]}>
                  {children}
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </Container>
    </Box>
  )
}

export default SidebarLayout
