import React, { useContext, useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  NewUserModal,
  TableHeaders,
  TableBody,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  Text,
  Box,
  Button,
  toast,
  ToastContainer,
} from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'
import * as headerStyles from '../../sharedStyles/Header.css'
import cn from 'classnames'

import {
  formatNationalId,
  Routes,
  Staff,
  staffRoleDescription,
} from '@island.is/financial-aid/shared/lib'
import {
  StaffForMunicipalityQuery,
  UpdateStaffMutation,
} from '@island.is/financial-aid-web/veita/graphql'
import { useRouter } from 'next/router'
import { AdminContext } from '../../components/AdminProvider/AdminProvider'

export const Users = () => {
  const [getStaff, { data, error, loading }] = useLazyQuery<{ users: Staff[] }>(
    StaffForMunicipalityQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )
  const [updateStaff, { loading: staffLoading }] = useMutation(
    UpdateStaffMutation,
  )

  const { admin } = useContext(AdminContext)
  const router = useRouter()

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

  const changeUserActivity = async (staff: Staff) => {
    return await updateStaff({
      variables: {
        input: {
          id: staff.id,
          active: !staff.active,
        },
      },
    })
      .then(() => {
        refreshList()
      })
      .catch(() => {
        toast.error(
          'Það mistókst að breyta hlutverki notanda, vinasamlega reynið aftur síðar',
        )
      })
  }

  const isLoggedInUser = (staff: Staff) =>
    admin?.nationalId === staff.nationalId

  const name = (staff: Staff) => {
    return (
      <Text variant="h5" color={staff.active ? 'dark400' : 'dark300'}>
        {staff.name} {isLoggedInUser(staff) ? '(Þú)' : ''}
      </Text>
    )
  }

  const nationalId = (staff: Staff) => {
    return (
      <Text color={staff.active ? 'dark400' : 'dark300'}>
        {formatNationalId(staff.nationalId)}
      </Text>
    )
  }

  const roleDescription = (staff: Staff) => {
    return (
      <Text color={staff.active ? 'dark400' : 'dark300'}>
        {staffRoleDescription(staff.roles)}
      </Text>
    )
  }

  const activationButton = (staff: Staff) => {
    return isLoggedInUser(staff) ? null : (
      <Box>
        <Button
          onClick={(event) => {
            event.stopPropagation()
            changeUserActivity(staff)
          }}
          variant="text"
          loading={staffLoading}
          colorScheme={staff.active ? 'destructive' : 'light'}
        >
          {staff.active ? 'Óvirkja' : 'Virkja'}
        </Button>
      </Box>
    )
  }

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
                  {headers.map((item, index) => (
                    <TableHeaders
                      header={{ title: item }}
                      index={index}
                      key={'tableHeaders-' + index}
                    />
                  ))}
                </tr>
              </thead>

              <tbody className={tableStyles.tableBody}>
                {users.map((item: Staff, index) => (
                  <TableBody
                    items={[
                      name(item),
                      nationalId(item),
                      roleDescription(item),
                      activationButton(item),
                    ]}
                    index={index}
                    identifier={item.id}
                    key={'tableBody-' + item.id}
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
