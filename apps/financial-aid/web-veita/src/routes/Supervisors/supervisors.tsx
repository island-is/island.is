import React, { useContext, useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  ActivationButtonTableItem,
  ApplicationOverviewSkeleton,
  LoadingContainer,
  TableBody,
  TableHeaders,
  TextTableItem,
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
  Staff,
  staffRoleDescription,
} from '@island.is/financial-aid/shared/lib'
import {
  SupervisorsQuery,
  UpdateStaffMutation,
} from '@island.is/financial-aid-web/veita/graphql'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

export const Supervisors = () => {
  const [getSupervisors, { data, error, loading }] = useLazyQuery<{
    supervisors: Staff[]
  }>(SupervisorsQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })
  const [updateStaff, { loading: staffLoading }] = useMutation(
    UpdateStaffMutation,
  )

  const [supervisors, setSupervisors] = useState<Staff[]>()

  useEffect(() => {
    getSupervisors()
  }, [])

  useEffect(() => {
    console.log('data', data)
    if (data?.supervisors) {
      setSupervisors(data.supervisors)
    }
  }, [data])

  const { admin } = useContext(AdminContext)

  const isLoggedInUser = (staff: Staff) =>
    admin?.nationalId === staff.nationalId

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
        getSupervisors()
      })
      .catch(() => {
        toast.error(
          'Það mistókst að breyta hlutverki notanda, vinasamlega reynið aftur síðar',
        )
      })
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
          Umsjónaraðilar
        </Text>
        <Button
          size="small"
          icon="add"
          variant="ghost"
          onClick={() => console.log('🔜')}
        >
          Nýr umsjónaraðili
        </Button>
      </Box>
      {supervisors && (
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
                {supervisors.map((item: Staff, index) => (
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
                          staffLoading,
                          () => changeUserActivity(item),
                          item.active,
                        ),
                    ]}
                    index={index}
                    identifier={item.id}
                    key={`tableBody-${item.id}`}
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
      <ToastContainer />
    </LoadingContainer>
  )
}

export default Supervisors
