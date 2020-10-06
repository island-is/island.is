/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useRouter } from 'next/router'
import { Button, FocusableBox } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import routeNames from '@island.is/web/i18n/routeNames'
import { SearchInput } from '../'
import * as styles from './MobileHeaderButtons.treat'

interface MobileHeaderButtonsProps {
  sideBarMenuOpen
  sideMenuSearchFocus
}

export const MobileHeaderButtons: FC<MobileHeaderButtonsProps> = ({
  sideBarMenuOpen,
  sideMenuSearchFocus,
}) => {
  const { activeLocale, t } = useI18n()

  const locale = activeLocale

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
