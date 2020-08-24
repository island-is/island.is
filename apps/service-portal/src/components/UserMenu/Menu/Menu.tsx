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
} from '@island.is/island-ui/core'
import { UserWithMeta, ServicePortalPath } from '@island.is/service-portal/core'
import IconButton from '../../Button/IconButton/IconButton'

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
  const subjectList = userInfo.mockSubjects
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
