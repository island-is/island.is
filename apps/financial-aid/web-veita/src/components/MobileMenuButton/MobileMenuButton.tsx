import React from 'react'

import * as styles from './MobileMenuButton.css'
import cn from 'classnames'

interface PageProps {
  showNav: boolean
  onClick: any
  className?: string
}

const MobileMenuButton = ({ showNav, onClick, className }: PageProps) => {
  return (
    <button
      className={cn({
        [`${styles.burgerMenu} burgerMenu`]: true,
        [`openBurgerMenu`]: showNav,
        [`${className}`]: className,
      })}
      onClick={onClick}
    >
      <span
        className={cn({
          [`${styles.burgerLines} ${styles.burgerMenuFirstChild}`]: true,
          [`${styles.openBurgerLines} ${styles.openBurgerLineFirstChild}`]:
            showNav,
        })}
      ></span>
      <span
        className={cn({
          [`${styles.burgerLines} `]: true,
          [`${styles.dissapearLine}`]: showNav,
        })}
      ></span>
      <span
        className={cn({
          [`${styles.burgerLines} ${styles.burgerMenuLastChilde}`]: true,
          [`${styles.openBurgerLines}  ${styles.openBurgerLineLastChild}`]:
            showNav,
        })}
      ></span>
    </button>
  )
}

export default MobileMenuButton
