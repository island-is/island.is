import type { ReactNode } from 'react'
import { Box, Button, Drawer } from '@island.is/island-ui/core'
import * as workspaceStyles from './TranslationWorkspace.css'

type TranslationWorkspaceLayoutProps = {
  preview: ReactNode
  navPanel: ReactNode
  isCompactNav: boolean
  navDrawerOpen: boolean
  openPanelLabel: string
  navDrawerAriaLabel: string
  onOpenNavDrawer: () => void
  onNavDrawerVisibilityChange: (visible: boolean) => void
  children?: ReactNode
}

export const TranslationWorkspaceLayout = ({
  preview,
  navPanel,
  isCompactNav,
  navDrawerOpen,
  openPanelLabel,
  navDrawerAriaLabel,
  onOpenNavDrawer,
  onNavDrawerVisibilityChange,
  children,
}: TranslationWorkspaceLayoutProps) => (
  <Box className={workspaceStyles.workspaceShell}>
    <div className={workspaceStyles.workspaceMainRow}>
      <div className={workspaceStyles.workspacePreviewAside}>{preview}</div>
      {isCompactNav ? (
        <>
          {!navDrawerOpen && (
            <Box className={workspaceStyles.navDrawerOpenButton}>
              <Button
                circle
                colorScheme="light"
                icon="menu"
                iconType="outline"
                onClick={onOpenNavDrawer}
                title={openPanelLabel}
                aria-label={openPanelLabel}
                aria-expanded={false}
                aria-haspopup="dialog"
                aria-controls="translation-workspace-nav-panel"
              />
            </Box>
          )}
          <Drawer
            baseId="translation-workspace-nav-panel"
            ariaLabel={navDrawerAriaLabel}
            position="right"
            isVisible={navDrawerOpen}
            hideOnClickOutside
            onVisibilityChange={onNavDrawerVisibilityChange}
            panelClassName={workspaceStyles.navDrawerPanel}
            contentClassName={workspaceStyles.navDrawerContent}
          >
            {navPanel}
          </Drawer>
        </>
      ) : (
        <div className={workspaceStyles.workspaceNavAside}>
          <div
            className={workspaceStyles.navColumn}
            id="translation-workspace-nav-panel"
          >
            {navPanel}
          </div>
        </div>
      )}
    </div>
    {children}
  </Box>
)
