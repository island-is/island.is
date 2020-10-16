/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useContext } from 'react'
import {
  Box,
  IconDeprecated as Icon,
  ColorSchemeContext,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import * as styles from './ComboButton.treat'
import cn from 'classnames'

import { Button as ReaButton } from 'reakit/Button'

interface ComboButtonProps {
  sideBarMenuOpen: () => void
  sideMenuSearchFocus: () => void
  showSearch: boolean
}

export const ComboButton: FC<ComboButtonProps> = ({
  sideBarMenuOpen,
  sideMenuSearchFocus,
  showSearch,
}) => {
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
            type={'search'}
            width={15}
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
        <Icon
          type={'burger'}
          width={15}
          color={colorSchemeIsWhite ? 'white' : 'blue400'}
        />
        <span className={styles.buttonText}>{t.menuCaption}</span>
      </Box>
    </>
  )
}

export default ComboButton
