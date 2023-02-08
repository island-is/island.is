import React, { FC } from 'react'

import {
  ToastContainer,
  Box,
  GridContainer,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'

import Header from '../Header/Header'
import * as styles from './Layout.css'
import {
  AccessDenied,
  PortalModule,
  useActiveModule,
  useModules,
} from '@island.is/portals/core'

const boxProps = {
  className: styles.container,
  background: 'white',
} as const

const getGridColumnSize = (layout: PortalModule['layout']) => {
  switch (layout) {
    case 'full':
      return {
        span: '12/12',
        offset: '0',
      } as const

    case 'default':
    default:
      return {
        span: '8/12',
        offset: '2/12',
      } as const
  }
}

const LayoutModuleContainer: FC<{ layout: PortalModule['layout'] }> = ({
  children,
  layout,
}) => {
  const hasNoneLayout = layout === 'none'

  if (hasNoneLayout) {
    return <Box {...boxProps}>{children}</Box>
  }

  const { offset, span } = getGridColumnSize(layout)

  return (
    <Box {...boxProps} paddingY={[3, 3, 3, 5]}>
      <GridContainer>
        <Box className={styles.contentBox}>
          <GridRow>
            <GridColumn
              offset={['0', '0', '0', offset]}
              span={['12/12', '12/12', '12/12', span]}
            >
              {children}
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>
    </Box>
  )
}

const LayoutOuterContainer: FC = ({ children }) => (
  <>
    <ToastContainer useKeyframeStyles={false} />
    <Header />
    {children}
  </>
)

export const Layout: FC = ({ children }) => {
  useNamespaces(['admin.portal', 'global'])
  const activeModule = useActiveModule()
  const modules = useModules()
  const { layout = 'default' } = activeModule || {}

  if (modules.length === 0) {
    return (
      <LayoutOuterContainer>
        <LayoutModuleContainer layout={layout}>
          <AccessDenied />
        </LayoutModuleContainer>
      </LayoutOuterContainer>
    )
  }

  return (
    <LayoutOuterContainer>
      <LayoutModuleContainer layout={!activeModule ? 'none' : layout}>
        {children}
      </LayoutModuleContainer>
    </LayoutOuterContainer>
  )
}
