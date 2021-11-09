import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  NewUserModal,
  TableHeaders,
  UsersTableBody,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  Text,
  Box,
  Button,
  toast,
  ToastContainer,
} from '@island.is/island-ui/core'
import * as styles from './users.css'
import cn from 'classnames'

import { Staff } from '@island.is/financial-aid/shared/lib'
import { StaffForMunicipalityQuery } from '@island.is/financial-aid-web/veita/graphql'

export const Users = () => {
  const [getStaff, { data, error, loading }] = useLazyQuery<{ users: Staff[] }>(
    StaffForMunicipalityQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  useEffect(() => {
    getStaff()
  }, [])

  const [isModalVisible, setIsModalVisible] = useState(false)

  const headers = ['Nafn', 'Kennitala', 'Hlutverk', 'Aðgerð']

  const [users, setUsers] = useState<Staff[]>()

  useEffect(() => {
    if (data?.users) {
      setUsers(data.users)
    }
  }, [data])

  const refreshList = () => {
    setIsModalVisible(false)
    getStaff()
  }

  return (
    <LoadingContainer
      isLoading={loading}
      loader={<ApplicationOverviewSkeleton />}
    >
      <Box
        className={`${styles.header} contentUp delay-25`}
        marginTop={15}
        marginBottom={[2, 2, 4]}
      >
        <Text as="h1" variant="h1">
          Notendur
        </Text>
        <Button
          size="small"
          icon="add"
          variant="ghost"
          onClick={() => setIsModalVisible(true)}
        >
          Nýr notandi
        </Button>
      </Box>
      {users && (
        <div className={`${styles.wrapper} hideScrollBar`}>
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
                  onStaffUpdated={refreshList}
                  toast={toast}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && (
        <div>
          Abbabab mistókst að sækja umsóknir, ertu örugglega með aðgang að þessu
          upplýsingum?
        </div>
      )}
      <NewUserModal
        isVisible={isModalVisible}
        setIsVisible={(visible) => {
          setIsModalVisible(visible)
        }}
        onStaffCreated={refreshList}
      />
      <ToastContainer />
    </LoadingContainer>
  )
}

export default Users
