import React, { FC } from 'react'
import cn from 'classnames'
import * as styles from './Menu.treat'
import { SubjectListDto } from '../../../mirage-server/models/subject'
import {
  Box,
  Icon,
  Typography,
  Divider,
  Button,
} from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import { User } from 'oidc-client'
import { ServicePortalPath } from '@island.is/service-portal/core'

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

  return (
    <div
      className={cn(styles.menu, {
        [styles.open]: isOpen,
      })}
    >
      <Box display="flex" alignItems="center" padding={3}>
        <div className={styles.avatar} />
        <div>
          <Link to={ServicePortalPath.StillingarRoot} onClick={onCloseMenu}>
            <Box display="flex" alignItems="center">
              <Box marginRight={2}>
                <Icon type="lock" color="dark300" />
              </Box>
              <Typography variant="pSmall" as="span">
                Stillingar
              </Typography>
            </Box>
          </Link>
          <Link to={ServicePortalPath.StillingarUmbod} onClick={onCloseMenu}>
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
        {/* TODO: This is a temp solution */}
        <a
          href="https://siidentityserverweb20200805020732.azurewebsites.net/Account/Logout"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button width="fluid">Útskráning</Button>
        </a>
      </Box>
    </div>
  )
}

export default Menu
