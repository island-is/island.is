import React, { FC, ReactNode, useState } from 'react'
import MenuButton from '../MenuButton/MenuButton'
import { Box, Icon, Typography } from '@island.is/island-ui/core'
import { useStateValue } from './../../stateProvider'

import * as styles from './UserNavigation.treat'

export interface UserNavigationProps {
  children?: ReactNode
  imageIcon?: string
  name?: string
  onClick?: () => void
}
const UserNavigation: FC<UserNavigationProps> = ({
  imageIcon,
  name,
  children,
}) => {
  const [{ userInfo }] = useStateValue()
  const [toggleNav, setToggleNav] = useState<boolean>(false)
  const handleToggle = () => {
    setToggleNav(!toggleNav)
  }

  const userName = userInfo?.actor?.name
  return (
    <div className={styles.navigationWrapper}>
      <MenuButton onClick={handleToggle}>
        <nav className={styles.navigation}>
          {imageIcon ? (
            <div
              className={styles.iconWrapper}
              style={{ backgroundImage: `url(${imageIcon})` }}
            />
          ) : (
            <Box
              className={styles.iconWrapper}
              display="flex"
              height="full"
              alignItems="center"
            >
              <Icon type="user" />
            </Box>
          )}
          {userName && <Typography as="span">{userName}</Typography>}
          <Box display="flex" alignItems="center" marginLeft="containerGutter">
            <Icon type="cheveron" width="15" height="15" />
          </Box>
        </nav>
      </MenuButton>
      {toggleNav && (
        <div className={styles.itemContainer}>
          <Box padding="gutter">penis Bubbi Skeinar</Box>
        </div>
      )}
    </div>
  )
}
export default UserNavigation
