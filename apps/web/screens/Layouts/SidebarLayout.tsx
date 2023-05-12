import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  ResponsiveSpace,
} from '@island.is/island-ui/core'

import * as styles from './SidebarLayout.css'
import cn from 'classnames'

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
  const Container = fullWidthContainer ? Box : GridContainer

  return (
    <Box paddingTop={paddingTop}>
      <Container
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(!fullWidthContainer && { position: ('none' as unknown) as any })}
      >
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
            marginLeft={fullWidthContainer ? 12 : 0}
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
