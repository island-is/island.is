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
import Link from 'next/link'
import { useMutation } from '@apollo/client'
import { UpdateStaffMutation } from '@island.is/financial-aid-web/veita/graphql'

interface PageProps {
  user: Staff
  index: number
  onStaffUpdated: () => void
  toast: {
    error: (message: string) => React.ReactText
  }
}

const UsersTableBody = ({ user, index, onStaffUpdated, toast }: PageProps) => {
  const { admin } = useContext(AdminContext)
  const [updateStaff, { loading }] = useMutation(UpdateStaffMutation)
  const isLoggedInUser = admin?.nationalId === user.nationalId

  const changeUserActivity = async (active: boolean) => {
    return await updateStaff({
      variables: {
        input: {
          id: user.id,
          active,
        },
      },
    })
      .then(() => {
        onStaffUpdated()
      })
      .catch(() => {
        toast.error(
          'Það mistókst að breyta hlutverki notanda, vinasamlega reynið aftur síðar',
        )
      })
  }

  return (
    <Link href={'notendur/' + user.id}>
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
              <Button
                onClick={(event) => {
                  event.stopPropagation()
                  changeUserActivity(false)
                }}
                variant="text"
                loading={loading}
                colorScheme="destructive"
              >
                Óvirkja
              </Button>
            ) : (
              <Button
                onClick={(event) => {
                  event.stopPropagation()
                  changeUserActivity(true)
                }}
                variant="text"
                loading={loading}
                colorScheme="light"
              >
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
