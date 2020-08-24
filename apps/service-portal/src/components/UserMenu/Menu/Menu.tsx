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
  Stack,
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
    <Box
      position="absolute"
      left={0}
      border="standard"
      width="full"
      className={cn(styles.menu, {
        [styles.open]: isOpen,
      })}
    >
      <Box padding={3} background="white">
        {/* TODO: Scope check */}
        <Stack space={1}>
          <Link
            to={ServicePortalPath.StillingarRoot}
            onClick={onCloseMenu}
            className={styles.link}
          >
            <Box display="flex" alignItems="center">
              <Box marginRight={2}>
                <Icon type="lock" color="dark300" />
              </Box>
              <Typography variant="p" as="span">
                Stillingar
              </Typography>
            </Box>
          </Link>
          <Link
            to={ServicePortalPath.StillingarUmbod}
            onClick={onCloseMenu}
            className={styles.link}
          >
            <Box display="flex" alignItems="center">
              <Box marginRight={2}>
                <Icon type="user" color="dark300" />
              </Box>
              <Typography variant="p" as="span">
                Umboðsveita
              </Typography>
            </Box>
          </Link>
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
      <Box padding={3}>
        {/* TODO: This is a temp solution */}
        <a
          href="https://siidentityserverweb20200805020732.azurewebsites.net/Account/Logout"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button width="fluid">Útskráning</Button>
        </a>
      </Box>
    </Box>
  )
}

export default Menu
