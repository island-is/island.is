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
} from '@island.is/island-ui/core'
import { UserWithMeta, ServicePortalPath } from '@island.is/service-portal/core'
import IconButton from '../../Button/IconButton/IconButton'
import useAuth from '../../../hooks/useAuth/useAuth'

interface Props {
  isOpen: boolean
  userInfo: UserWithMeta
  subjectList: SubjectListDto[]
  onSubjectSelection: (subjectNationalId: string) => void
  onCloseMenu: () => void
}

export const Menu: FC<Props> = ({
  isOpen,
  userInfo,
  onSubjectSelection,
  onCloseMenu,
}) => {
  const { signOutUser } = useAuth()
  const subjectList = userInfo.mockSubjects
  const personSubjects = subjectList.filter((x) => x.subjectType === 'person')
  const companySubjects = subjectList.filter((x) => x.subjectType === 'company')

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
            className={styles.avatar}
            style={{
              backgroundImage: `url(https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png)`,
            }}
          />
          <Typography variant="h4">{userInfo.user.profile.name}</Typography>
        </Box>
        <Divider />
      </Hidden>
      <Box padding={3} background="white">
        {/* TODO: Scope check */}
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
      {personSubjects.length > 0 && (
        <>
          <Divider />
          <Box paddingY={2} paddingX={3}>
            <Stack space={1}>
              <Typography variant="h5">Umboð</Typography>
              {personSubjects.map((person) => (
                <button
                  className={styles.subjectButton}
                  key={person.nationalId}
                  onClick={onSubjectSelection.bind(null, person.nationalId)}
                >
                  {person.name}
                </button>
              ))}
            </Stack>
          </Box>
        </>
      )}
      {companySubjects.length > 0 && (
        <>
          <Divider />
          <Box paddingY={2} paddingX={3}>
            <Stack space={1}>
              <Typography variant="h5">Fyrirtæki</Typography>
              {companySubjects.map((company) => (
                <button
                  className={styles.subjectButton}
                  key={company.nationalId}
                  onClick={onSubjectSelection.bind(null, company.nationalId)}
                >
                  {company.name}
                </button>
              ))}
            </Stack>
          </Box>
        </>
      )}
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
