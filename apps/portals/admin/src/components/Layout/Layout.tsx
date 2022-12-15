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
  useModules,
  useModuleProps,
  PortalModule,
  usePortalMeta,
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
  const { portalType } = usePortalMeta()
  const { activeModule } = useModules()
  const moduleProps = useModuleProps()
  const { layout = 'default', moduleLayoutWrapper: ModuleLayoutWrapper } =
    activeModule || {}

  if (ModuleLayoutWrapper) {
    return (
      <LayoutOuterContainer>
        <ModuleLayoutWrapper {...moduleProps} portalType={portalType}>
          <LayoutModuleContainer layout={layout}>
            {children}
          </LayoutModuleContainer>
        </ModuleLayoutWrapper>
      </LayoutOuterContainer>
    )
  }

  return (
    <LayoutOuterContainer>
      <LayoutModuleContainer layout={layout}>{children}</LayoutModuleContainer>
    </LayoutOuterContainer>
  )
}
