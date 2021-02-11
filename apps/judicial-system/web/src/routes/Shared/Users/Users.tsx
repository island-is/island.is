import React, { useEffect } from 'react'
import cn from 'classnames'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import {
  Loading,
  DropdownMenu,
} from '@island.is/judicial-system-web/src/shared-components'
import { User, UserRole } from '@island.is/judicial-system/types'
import * as styles from './Users.treat'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { formatNationalId } from '@island.is/libs/judicial-system/formatters/src'

interface UserData {
  users: User[]
}

export const Users: React.FC = () => {
  const history = useHistory()

  const { data, error, loading } = useQuery<UserData>(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    document.title = 'Notendur - Réttarvörslugátt'
  }, [])

  const handleClick = (user: User): void => {
    history.push(`${Constants.USER_CHANGE_ROUTE}/${user.id}`)
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
    <div className={styles.detentionRequestsContainer}>
      <div className={styles.logoContainer}>
        <DropdownMenu
          menuLabel="Tegund kröfu"
          icon="add"
          items={[
            {
              href: Constants.USER_NEW_ROUTE,
              title: 'Notenda',
            },
            {
              title: 'Stofnun',
              onClick: () => alert('Ekki útfært'),
            },
          ]}
          title="Bæta við"
        />
      </div>
      <Box marginBottom={3}>
        <Text variant="h3" id="tableCaption">
          Notendur
        </Text>
      </Box>
      {data && (
        <table
          className={styles.detentionRequestsTable}
          data-testid="detention-requests-table"
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
                data-testid="detention-requests-table-row"
                role="button"
                aria-label="Opna notenda"
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
                  <Text as="span">{user.institution}</Text>
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
        <Box className={styles.detentionRequestsTable}>
          <Loading />
        </Box>
      )}
      {error && (
        <div
          className={styles.detentionRequestsError}
          data-testid="detention-requests-error"
        >
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
