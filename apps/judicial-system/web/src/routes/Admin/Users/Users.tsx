import React, { useEffect } from 'react'
import cn from 'classnames'
import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { Loading } from '@island.is/judicial-system-web/src/shared-components'
import { UserRole } from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useQuery } from '@apollo/client'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { formatNationalId } from '@island.is/judicial-system/formatters'
import { useRouter } from 'next/router'
import * as styles from './Users.treat'

interface UserData {
  users: User[]
}

export const Users: React.FC = () => {
  const router = useRouter()

  const { data, error, loading } = useQuery<UserData>(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    document.title = 'Notendur - Réttarvörslugátt'
  }, [])

  const handleClick = (user: User): void => {
    router.push(`${Constants.USER_CHANGE_ROUTE}/${user.id}`)
  }

  const userRoleToString = (userRole: UserRole) => {
    switch (userRole) {
      case UserRole.JUDGE:
        return 'Dómari'
      case UserRole.PROSECUTOR:
        return 'Saksóknari'
      case UserRole.REGISTRAR:
        return 'Dómritari'
    }
  }

  return (
    <div className={styles.userControlContainer}>
      <div className={styles.logoContainer}>
        <Button
          icon="add"
          onClick={() => {
            router.push(Constants.USER_NEW_ROUTE)
          }}
        >
          Nýr notandi
        </Button>
      </div>
      <Box marginBottom={3}>
        <Text variant="h3" id="tableCaption">
          Notendur
        </Text>
      </Box>
      {data && (
        <table
          className={styles.userTable}
          data-testid="users-table"
          aria-describedby="tableCation"
        >
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>
                <Text as="span" fontWeight="regular">
                  Nafn
                </Text>
              </th>
              <th className={styles.th}>
                <Text as="span" fontWeight="regular">
                  Kennitala
                </Text>
              </th>
              <th className={styles.th}>
                <Text as="span" fontWeight="regular">
                  Hlutverk
                </Text>
              </th>
              <th className={styles.th}>
                <Text as="span" fontWeight="regular">
                  Stofnun
                </Text>
              </th>
              <th className={styles.th}>
                <Text as="span" fontWeight="regular">
                  Virkur
                </Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.users.map((user, i) => (
              <tr
                key={i}
                className={cn(styles.tableRowContainer)}
                role="button"
                aria-label="Opna notanda"
                onClick={() => {
                  handleClick(user)
                }}
              >
                <td className={styles.td}>
                  <Text as="span">{user.name}</Text>
                </td>
                <td className={styles.td}>
                  <Text as="span">{formatNationalId(user.nationalId)}</Text>
                </td>
                <td className={styles.td}>
                  <Text as="span">{userRoleToString(user.role)}</Text>
                </td>
                <td className={styles.td}>
                  <Text as="span">{user.institution?.name}</Text>
                </td>
                <td className={styles.td}>
                  <Text as="span">{user.active ? 'Já' : 'Nei'}</Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {loading && (
        <Box className={styles.userTable}>
          <Loading />
        </Box>
      )}
      {error && (
        <div className={styles.userError} data-testid="users-error">
          <AlertMessage
            title="Ekki tókst að sækja gögn úr gagnagrunni"
            message="Ekki tókst að ná sambandi við gagnagrunn. Málið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar."
            type="error"
          />
        </div>
      )}
    </div>
  )
}

export default Users
