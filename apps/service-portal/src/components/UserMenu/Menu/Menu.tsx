import React, { FC } from 'react'
import cn from 'classnames'

import * as styles from './Menu.treat'
// eslint-disable-next-line
import { JwtToken } from 'apps/service-portal/src/mirage-server/models/jwt-model'
// eslint-disable-next-line
import { SubjectListDto } from 'apps/service-portal/src/mirage-server/models/subject'
import {
  Box,
  Icon,
  Typography,
  Divider,
  Button,
} from '@island.is/island-ui/core'
import { Link, useHistory } from 'react-router-dom'
// eslint-disable-next-line
import { removeToken } from 'apps/service-portal/src/auth/utils'
import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'
import { User } from 'oidc-client'

interface Props {
  isOpen: boolean
  userInfo: User
  subjectList: SubjectListDto[]
  onSubjectSelection: (subjectNationalId: string) => void
  onCloseMenu: () => void
}

export const Menu: FC<Props> = ({
  isOpen,
  subjectList,
  onSubjectSelection,
  onCloseMenu,
}) => {
  const personSubjects = subjectList.filter((x) => x.subjectType === 'person')
  const companySubjects = subjectList.filter((x) => x.subjectType === 'company')
  const history = useHistory()

  const handleLogout = async () => {
    await removeToken()
    // TODO: Loading state, Hard reload?
    localStorage.removeItem(MOCK_AUTH_KEY)
    history.push('/innskraning')
  }

  return (
    <div
      className={cn(styles.menu, {
        [styles.open]: isOpen,
      })}
    >
      <Box display="flex" alignItems="center" padding={3}>
        <div className={styles.avatar} />
        <div>
          <Link to="/stillingar" onClick={onCloseMenu}>
            <Box display="flex" alignItems="center">
              <Box marginRight={2}>
                <Icon type="lock" color="dark300" />
              </Box>
              <Typography variant="pSmall" as="span">
                Stillingar
              </Typography>
            </Box>
          </Link>
          <Link to="/stillingar/umbod" onClick={onCloseMenu}>
            <Box display="flex" alignItems="center">
              <Box marginRight={2}>
                <Icon type="user" color="dark300" />
              </Box>
              <Typography variant="pSmall" as="span">
                Umboðsveita
              </Typography>
            </Box>
          </Link>
        </div>
      </Box>
      <Divider />
      <Box paddingY={3} paddingX={4}>
        <Typography variant="h5">Umboð</Typography>
        <Box marginTop={1}>
          {personSubjects.map((person) => (
            <button
              className={styles.subjectButton}
              key={person.nationalId}
              onClick={onSubjectSelection.bind(null, person.nationalId)}
            >
              {person.name}
            </button>
          ))}
        </Box>
      </Box>
      <Divider />
      <Box paddingY={3} paddingX={4}>
        <Typography variant="h5">Fyrirtæki</Typography>
        <Box marginTop={1}>
          {companySubjects.map((company) => (
            <button
              className={styles.subjectButton}
              key={company.nationalId}
              onClick={onSubjectSelection.bind(null, company.nationalId)}
            >
              {company.name}
            </button>
          ))}
        </Box>
      </Box>
      <Box paddingX={4} paddingBottom={3}>
        <Button width="fluid" onClick={handleLogout}>
          Útskráning
        </Button>
      </Box>
    </div>
  )
}

export default Menu
