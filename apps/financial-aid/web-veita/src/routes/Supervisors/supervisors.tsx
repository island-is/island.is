import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  TableHeaders,
} from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box, Button } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'
import * as headerStyles from '../../sharedStyles/Header.css'
import cn from 'classnames'

import { Staff } from '@island.is/financial-aid/shared/lib'
import { StaffForMunicipalityQuery } from '@island.is/financial-aid-web/veita/graphql'

export const Supervisors = () => {
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
                        key={'tableHeaders-' + index}
                      />
                    ),
                  )}
                </tr>
              </thead>

              <tbody className={tableStyles.tableBody}></tbody>
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
    </LoadingContainer>
  )
}

export default Supervisors
