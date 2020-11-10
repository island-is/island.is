import React, { FC, useState, createContext } from 'react'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'
import { Colors } from '@island.is/island-ui/theme'
import { Icon } from '../Icon/Icon'
import { Box } from '../Box/Box'

import * as styles from './Sleeve.treat'

export type SleeveBoxShadow = 'normal' | 'purple'

interface SleeveProps {
  open?: boolean
  minHeight?: number
  sleeveShadow?: SleeveBoxShadow
  background?: Colors
}

export interface SleeveContextProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const SleeveContext = createContext<SleeveContextProps>({
  isOpen: false,
  setIsOpen: () => null,
})

export const Sleeve: FC<SleeveProps> = ({
  children,
  open = false,
  minHeight = 320,
  background = 'white',
  sleeveShadow = 'normal',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(open)

  const onToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <SleeveContext.Provider value={{ isOpen: isOpen, setIsOpen }}>
      <Box
        background={background}
        className={cn(styles.container, { [styles.open]: isOpen })}
      >
        <Box
          className={cn(styles.wrapper, styles.sleeveBoxShadow[sleeveShadow])}
        >
          <AnimateHeight duration={1000} height={isOpen ? 'auto' : minHeight}>
            {children}
          </AnimateHeight>
        </Box>
        <Box className={styles.togglerWrapper}>
          <button
            className={cn(styles.toggler, { [styles.togglerOpen]: isOpen })}
            onClick={onToggle}
          >
            <Icon color="white" width="18" height="18" type="arrowUp" />
          </button>
        </Box>
      </Box>
    </SleeveContext.Provider>
  )
}
