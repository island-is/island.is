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
  PortalHeaderSlotProvider,
  PortalModule,
  useActiveModule,
  useModules,
  useRouteLayout,
} from '@island.is/portals/core'

const boxProps = {
  className: styles.container,
  background: 'white',
} as const

/** Matches application FormShell outer shell: white on small screens, purple100 from md. */
const workspaceBackground = ['white', 'white', 'purple100'] as const

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

type LayoutModuleContainerProps = {
  layout: PortalModule['layout']
}

const LayoutModuleContainer: FC<
  React.PropsWithChildren<LayoutModuleContainerProps>
> = React.memo(
  ({ children, layout }) => {
    const hasNoneLayout = layout === 'none'

    if (hasNoneLayout) {
      return <Box {...boxProps}>{children}</Box>
    }

    if (layout === 'workspace') {
      return (
        <Box
          className={styles.workspaceContainer}
          background={workspaceBackground}
          overflow="hidden"
        >
          {children}
        </Box>
      )
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
  },
  (prevProps, nextProps) => prevProps.layout === nextProps.layout,
)

const LayoutOuterContainer: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => (
  <PortalHeaderSlotProvider>
    <ToastContainer useKeyframeStyles={false} />
    <Header />
    {children}
  </PortalHeaderSlotProvider>
)

export const Layout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  useNamespaces(['admin.portal', 'global', 'portals'])
  const activeModule = useActiveModule()
  const modules = useModules()
  const layout = useRouteLayout() ?? activeModule?.layout ?? 'default'

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
