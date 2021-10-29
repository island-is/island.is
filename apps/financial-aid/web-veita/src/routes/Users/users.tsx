import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  TableHeaders,
  UsersTableBody,
} from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box } from '@island.is/island-ui/core'
import * as styles from './users.css'
import cn from 'classnames'

import { Staff } from '@island.is/financial-aid/shared/lib'
import { StaffForMunicipalityQuery } from '@island.is/financial-aid-web/veita/graphql'

export const Users = () => {
  const { data, error, loading } = useQuery<{ users: Staff[] }>(
    StaffForMunicipalityQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const headers = ['Nafn', 'Kennitala', 'Hlutverk', 'Aðgerð']

  const [users, setUsers] = useState<Staff[]>()

  useEffect(() => {
    if (data?.users) {
      setUsers(data.users)
    }
  }, [data])

  return (
    <LoadingContainer
      isLoading={loading}
      loader={<ApplicationOverviewSkeleton />}
    >
      <Box className={`contentUp delay-25`} marginTop={15} key={'Notendur'}>
        <Text as="h1" variant="h1" marginBottom={[2, 2, 4]}>
          Notendur
        </Text>
      </Box>

      {users && (
        <table
          className={cn({
            [`${styles.tableContainer}`]: true,
          })}
        >
          <thead className={`contentUp delay-50`}>
            <tr>
              {headers.map((item, index) => (
                <TableHeaders
                  header={{ title: item }}
                  index={index}
                  key={'tableHeaders-' + index}
                />
              ))}
            </tr>
          </thead>

          <tbody className={styles.tableBody}>
            {users.map((item: Staff, index) => (
              <UsersTableBody
                user={item}
                index={index}
                key={'tableBody-' + item.id}
              />
            ))}
          </tbody>
        </table>
      )}

      {error && (
        <div>
          Abbabab mistókst að sækja umsóknir, ertu örugglega með aðgang að þessu
          upplýsingum?
        </div>
      )}
    </LoadingContainer>
  )
}

export default Users
