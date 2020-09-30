import React, { FC } from 'react'
import cn from 'classnames'
import * as styles from './Menu.treat'
import { SubjectListDto } from '../../../mirage-server/models/subject'
import {
  Box,
  Typography,
  Divider,
  Button,
  Stack,
  Hidden,
  Icon,
} from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import IconButton from '../../Button/IconButton/IconButton'
import useAuth from '../../../hooks/useAuth/useAuth'
import { User } from 'oidc-client'

interface Props {
  isOpen: boolean
  userInfo: User
  subjectList: SubjectListDto[]
  onSubjectSelection: (subjectNationalId: string) => void
  onCloseMenu: () => void
}

export const Menu: FC<Props> = ({ isOpen, userInfo, onCloseMenu }) => {
  const { signOutUser } = useAuth()
  const handleLogoutClick = () => signOutUser()

  return (
    <Box
      border="standard"
      width="full"
      className={cn(styles.menu, {
        [styles.open]: isOpen,
      })}
    >
      <Hidden above="sm">
        <Box display="flex" alignItems="center" padding={2} background="white">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            background="blue200"
            className={styles.avatar}
          >
            <Icon type="user" width={30} height={30} />
          </Box>
          <Typography variant="h4">{userInfo?.profile.name}</Typography>
        </Box>
        <Divider />
      </Hidden>
      <Box padding={3} background="white">
        <Stack space={1}>
          <IconButton
            url={ServicePortalPath.StillingarRoot}
            onClick={onCloseMenu}
            icon="lock"
          >
            Stillingar
          </IconButton>
          <IconButton
            url={ServicePortalPath.StillingarUmbod}
            onClick={onCloseMenu}
            icon="user"
          >
            Umboðsveita
          </IconButton>
        </Stack>
      </Box>
      <Divider />
      <Box padding={3}>
        <Button width="fluid" onClick={handleLogoutClick}>
          Útskráning
        </Button>
      </Box>
    </Box>
  )
}

export default Menu
