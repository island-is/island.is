import React, { useContext } from 'react'
import { Text, Box, Button } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'
import cn from 'classnames'

import {
  Staff,
  formatNationalId,
  staffRoleDescription,
} from '@island.is/financial-aid/shared/lib'
import { AdminContext } from '../AdminProvider/AdminProvider'
import Link from 'next/link'

interface PageProps {
  user: Staff
  index: number
}

const UsersTableBody = ({ user, index }: PageProps) => {
  const { admin } = useContext(AdminContext)
  const isLoggedInUser = admin?.nationalId === user.nationalId
  return (
    <Link href={'notendur/' + user.id}>
      <tr
        className={`${tableStyles.link} contentUp`}
        style={{ animationDelay: 55 + 3.5 * index + 'ms' }}
      >
        <td
          className={cn({
            [`${tableStyles.tablePadding} ${tableStyles.firstChildPadding}`]: true,
          })}
        >
          <Box className={tableStyles.rowContent}>
            <Text variant="h5" color={user.active ? 'dark400' : 'dark300'}>
              {user.name} {isLoggedInUser ? '(Þú)' : ''}
            </Text>
          </Box>
        </td>

        <td
          className={cn({
            [`${tableStyles.tablePadding} `]: true,
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
            [`${tableStyles.tablePadding} `]: true,
          })}
        >
          <Box className={tableStyles.rowContent}>
            <Text color={user.active ? 'dark400' : 'dark300'}>
              {staffRoleDescription(user.roles)}
            </Text>
          </Box>
        </td>

        {isLoggedInUser === false && (
          <td
            className={cn({
              [`${tableStyles.tablePadding} `]: true,
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
    </Link>
  )
}

export default UsersTableBody
