/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react'
import cn from 'classnames'
import { Button as ReaButton } from 'reakit/Button'

import { Box, ColorSchemeContext, Icon } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'

import * as styles from './ComboButton.css'

interface ComboButtonProps {
  sideBarMenuOpen: () => void
  sideMenuSearchFocus: () => void
  showSearch: boolean
}

export const ComboButton = ({
  sideBarMenuOpen,
  sideMenuSearchFocus,
  showSearch,
}: ComboButtonProps) => {
  const { t } = useI18n()
  const { colorScheme } = useContext(ColorSchemeContext)
  const colorSchemeIsWhite = colorScheme === 'white'

  return (
    <>
      {showSearch && (
        <Box
          component={ReaButton}
          as={'button'}
          className={cn(styles.buttonBase, styles.searchButton, {
            [styles.white]: colorSchemeIsWhite,
          })}
          onClick={sideMenuSearchFocus}
        >
          <Icon
            size="small"
            type="filled"
            icon="search"
            color={colorSchemeIsWhite ? 'white' : 'blue400'}
          />
        </Box>
      )}
      <Box
        component={ReaButton}
        as={'button'}
        className={cn(styles.buttonBase, {
          [styles.menuButton]: showSearch,
          [styles.white]: colorSchemeIsWhite,
        })}
        onClick={sideBarMenuOpen}
      >
        <span className={styles.buttonText}>{t.menuCaption}</span>
        <Icon
          size="small"
          type="filled"
          icon="menu"
          color={colorSchemeIsWhite ? 'white' : 'blue400'}
        />
      </Box>
    </>
  )
}

export default ComboButton
