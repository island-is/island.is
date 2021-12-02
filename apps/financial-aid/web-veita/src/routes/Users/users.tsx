import React, { useContext, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  NewUserModal,
  TableHeaders,
  TableBody,
  TextTableItem,
  ActivationButtonTableItem,
} from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box, Button, ToastContainer } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'
import * as headerStyles from '../../sharedStyles/Header.css'
import cn from 'classnames'

import {
  formatNationalId,
  Routes,
  Staff,
  staffRoleDescription,
} from '@island.is/financial-aid/shared/lib'
import { StaffForMunicipalityQuery } from '@island.is/financial-aid-web/veita/graphql'
import { useRouter } from 'next/router'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'
import { useStaff } from '@island.is/financial-aid-web/veita/src/utils/useStaff'

export const Users = () => {
  const [getStaff, { data, error, loading }] = useLazyQuery<{ users: Staff[] }>(
    StaffForMunicipalityQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const { changeUserActivity, staffActivationLoading } = useStaff()

  const { admin } = useContext(AdminContext)
  const router = useRouter()

  useEffect(() => {
    getStaff()
  }, [])

  const [isModalVisible, setIsModalVisible] = useState(false)
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

  const isLoggedInUser = (staff: Staff) =>
    admin?.nationalId === staff.nationalId

  return (
    <LoadingContainer
      isLoading={loading}
      loader={<ApplicationOverviewSkeleton />}
    >
      <Box
        className={`${headerStyles.header} contentUp delay-25`}
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
        <div className={`${tableStyles.wrapper} hideScrollBar`}>
          <div className={tableStyles.smallTableWrapper}>
            <table
              className={cn({
                [`${tableStyles.tableContainer}`]: true,
              })}
            >
              <thead className={`contentUp delay-50`}>
                <tr>
                  {['Nafn', 'Kennitala', 'Hlutverk', 'Aðgerð'].map(
                    (item, index) => (
                      <TableHeaders
                        header={{ title: item }}
                        index={index}
                        key={`tableHeaders-${index}`}
                      />
                    ),
                  )}
                </tr>
              </thead>

              <tbody className={tableStyles.tableBody}>
                {users.map((item: Staff, index) => (
                  <TableBody
                    items={[
                      TextTableItem(
                        'h5',
                        `${item.name} ${isLoggedInUser(item) ? '(Þú)' : ''}`,
                        item.active ? 'dark400' : 'dark300',
                      ),
                      TextTableItem(
                        'default',
                        formatNationalId(item.nationalId),
                        item.active ? 'dark400' : 'dark300',
                      ),
                      TextTableItem(
                        'default',
                        staffRoleDescription(item.roles),
                        item.active ? 'dark400' : 'dark300',
                      ),
                      isLoggedInUser(item) === false &&
                        ActivationButtonTableItem(
                          item.active ? 'Óvirkja' : 'Virkja',
                          staffActivationLoading,
                          () =>
                            changeUserActivity(!item.active, item.id).then(
                              () => {
                                refreshList()
                              },
                            ),
                          item.active,
                        ),
                    ]}
                    index={index}
                    identifier={item.id}
                    key={`tableBody-${item.id}`}
                    onClick={() => router.push(Routes.userProfile(item.id))}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {error && (
        <div>
          Abbabab mistókst að sækja notendur, ertu örugglega með aðgang að þessu
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
