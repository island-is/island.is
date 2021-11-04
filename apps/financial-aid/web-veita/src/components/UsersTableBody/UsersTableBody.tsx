import React, { useContext } from 'react'
import { Text, Box, Button } from '@island.is/island-ui/core'

import * as styles from './UsersTableBody.css'
import cn from 'classnames'

import {
  Staff,
  formatNationalId,
  staffRoleDescription,
} from '@island.is/financial-aid/shared/lib'
import { AdminContext } from '../AdminProvider/AdminProvider'

interface PageProps {
  user: Staff
  index: number
}

const UsersTableBody = ({ user, index }: PageProps) => {
  const { admin } = useContext(AdminContext)
  const isLoggedInUser = admin?.nationalId === user.nationalId
  return (
    <tr
      className={`${styles.link} contentUp`}
      style={{ animationDelay: 55 + 3.5 * index + 'ms' }}
    >
      <td
        className={cn({
          [`${styles.tablePadding} ${styles.firstChildPadding}`]: true,
        })}
      >
        <Box display="flex">
          <Text variant="h5" color={user.active ? 'dark400' : 'dark300'}>
            {user.name} {isLoggedInUser ? '(Þú)' : ''}
          </Text>
        </Box>
      </td>

      <td
        className={cn({
          [`${styles.tablePadding} `]: true,
        })}
      >
        <Box display="flex">
          <Text color={user.active ? 'dark400' : 'dark300'}>
            {formatNationalId(user.nationalId)}
          </Text>
        </Box>
      </td>

      <td
        className={cn({
          [`${styles.tablePadding} `]: true,
        })}
      >
        <Text color={user.active ? 'dark400' : 'dark300'}>
          {staffRoleDescription(user.roles)}
        </Text>
      </td>

      {isLoggedInUser === false && (
        <td
          className={cn({
            [`${styles.tablePadding} `]: true,
          })}
        >
          {user.active ? (
            <Button variant="text" colorScheme="destructive">
              Óvirkja
            </Button>
          ) : (
            <Button variant="text" colorScheme="light">
              Virkja
            </Button>
          )}
        </td>
      )}
    </tr>
  )
}

export default UsersTableBody
