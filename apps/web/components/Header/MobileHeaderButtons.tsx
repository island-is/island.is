/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { Button } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import * as styles from './MobileHeaderButtons.treat'

interface MobileHeaderButtonsProps {
  sideBarMenuOpen: () => void
  sideMenuSearchFocus: () => void
}

export const MobileHeaderButtons: FC<MobileHeaderButtonsProps> = ({
  sideBarMenuOpen,
  sideMenuSearchFocus,
}) => {
  const { t } = useI18n()

  return (
    <>
      <Button
        variant="menu"
        icon="search"
        customClassName={styles.searchButton}
        onClick={sideMenuSearchFocus}
      />
      <Button
        variant="menu"
        customClassName={styles.menuButton}
        onClick={sideBarMenuOpen}
        leftIcon="burger"
      >
        {t.menuCaption}
      </Button>
    </>
  )
}

export default MobileHeaderButtons
