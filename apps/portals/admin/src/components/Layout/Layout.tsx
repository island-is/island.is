import React, { FC } from 'react'
import { useLocation } from 'react-router-dom'

import {
  ToastContainer,
  Box,
  GridContainer,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'

import {
  isApplicationTranslationWorkspacePath,
  isSharedNamespaceTranslationPath,
  TranslationWorkspaceHeaderBridgeProvider,
} from '@island.is/portals/admin/application-system'

import Header from '../Header/Header'
import * as styles from './Layout.css'
import {
  AccessDenied,
  PortalModule,
  useActiveModule,
  useModules,
} from '@island.is/portals/core'

/** Matches application FormShell outer shell: white on small screens, purple100 from md. */
const fullLayoutBackground = ['white', 'white', 'purple100'] as const

const moduleContainerBoxProps = {
  className: styles.container,
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

type LayoutModuleContainerProps = {
  layout: PortalModule['layout']
  pageBackground: 'white' | typeof fullLayoutBackground
  fullBleed?: boolean
}

const LayoutModuleContainer: FC<
  React.PropsWithChildren<LayoutModuleContainerProps>
> = React.memo(
  ({ children, layout, pageBackground, fullBleed }) => {
    const hasNoneLayout = layout === 'none'

    if (hasNoneLayout) {
      return (
        <Box {...moduleContainerBoxProps} background="white">
          {children}
        </Box>
      )
    }

    if (fullBleed) {
      return (
        <Box {...moduleContainerBoxProps} background={pageBackground}>
          {children}
        </Box>
      )
    }

    const { offset, span } = getGridColumnSize(layout)

    return (
      <Box
        {...moduleContainerBoxProps}
        background={pageBackground}
        paddingY={[3, 3, 3, 5]}
      >
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
  (prevProps, nextProps) =>
    prevProps.layout === nextProps.layout &&
    prevProps.pageBackground === nextProps.pageBackground &&
    prevProps.fullBleed === nextProps.fullBleed,
)

const LayoutOuterContainer: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => (
  <TranslationWorkspaceHeaderBridgeProvider>
    <>
      <ToastContainer useKeyframeStyles={false} />
      <Header />
      {children}
    </>
  </TranslationWorkspaceHeaderBridgeProvider>
)

export const Layout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  useNamespaces(['admin.portal', 'global', 'portals'])
  const activeModule = useActiveModule()
  const modules = useModules()
  const { pathname } = useLocation()
  const { layout = 'default' } = activeModule || {}

  const onApplicationTranslationWorkspaceRoute =
    isApplicationTranslationWorkspacePath(pathname)
  const onSharedNamespaceTranslationRoute =
    isSharedNamespaceTranslationPath(pathname)

  const pageBackground: LayoutModuleContainerProps['pageBackground'] =
    layout === 'full' && onApplicationTranslationWorkspaceRoute
      ? fullLayoutBackground
      : 'white'

  const effectiveLayout = onSharedNamespaceTranslationRoute ? 'default' : layout

  if (modules.length === 0) {
    return (
      <LayoutOuterContainer>
        <LayoutModuleContainer layout={layout} pageBackground="white">
          <AccessDenied />
        </LayoutModuleContainer>
      </LayoutOuterContainer>
    )
  }

  return (
    <LayoutOuterContainer>
      <LayoutModuleContainer
        layout={!activeModule ? 'none' : effectiveLayout}
        pageBackground={pageBackground}
        fullBleed={onApplicationTranslationWorkspaceRoute}
      >
        {children}
      </LayoutModuleContainer>
    </LayoutOuterContainer>
  )
}
