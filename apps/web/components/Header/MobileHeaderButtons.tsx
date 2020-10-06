/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { Button } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import * as styles from './MobileHeaderButtons.treat'

interface MobileHeaderButtonsProps {
  sideBarMenuOpen: () => void
  sideMenuSearchFocus: () => void
  showSearch: boolean
}

export const MobileHeaderButtons: FC<MobileHeaderButtonsProps> = ({
  sideBarMenuOpen,
  sideMenuSearchFocus,
  showSearch,
}) => {
  const { t } = useI18n()

  return (
    <>
      {showSearch && (
        <Button
          variant="menu"
          icon="search"
          customClassName={styles.searchButton}
          onClick={sideMenuSearchFocus}
        />
      )}
      <Button
        variant="menu"
        customClassName={showSearch ? styles.menuButton : ''}
        onClick={sideBarMenuOpen}
        leftIcon="burger"
      >
        {t.menuCaption}
      </Button>
    </>
  )
}

export default MobileHeaderButtons
