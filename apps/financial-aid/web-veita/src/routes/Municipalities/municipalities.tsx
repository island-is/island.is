import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import {
  ActivationButtonTableItem,
  ApplicationOverviewSkeleton,
  LoadingContainer,
  TableBody,
  TableHeaders,
  TextTableItem,
} from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box, Button } from '@island.is/island-ui/core'
import * as tableStyles from '../../sharedStyles/Table.css'
import * as headerStyles from '../../sharedStyles/Header.css'
import cn from 'classnames'

import { Municipality, Routes } from '@island.is/financial-aid/shared/lib'
import { MunicipalitiesQuery } from '@island.is/financial-aid-web/veita/graphql'
import { useRouter } from 'next/router'

export const Municipalities = () => {
  const [getMunicipalities, { data, error, loading }] = useLazyQuery<{
    municipalities: Municipality[]
  }>(MunicipalitiesQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const router = useRouter()

  useEffect(() => {
    getMunicipalities()
  }, [])

  const headers = ['Nafn', 'Notendur', 'Aðgerð']

  const [municipalities, setMunicipalities] = useState<Municipality[]>()

  useEffect(() => {
    if (data?.municipalities) {
      setMunicipalities(data.municipalities)
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
          Sveitarfélög
        </Text>
        <Button size="small" icon="add" variant="ghost">
          Nýtt sveitarfélag
        </Button>
      </Box>

      {municipalities && (
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
                      key={`tableHeaders-${index}`}
                    />
                  ))}
                </tr>
              </thead>

              <tbody className={tableStyles.tableBody}>
                {municipalities.map((item: Municipality, index) => (
                  <TableBody
                    items={[
                      TextTableItem(
                        'h5',
                        item.name,
                        item.active ? 'dark400' : 'dark300',
                      ),
                      TextTableItem(
                        'default',
                        item.users,
                        item.active ? 'dark400' : 'dark300',
                      ),
                      ActivationButtonTableItem(
                        item.active ? 'Óvirkja' : 'Virkja',
                        false,
                        () => console.log('bla'),
                        item.active,
                      ),
                    ]}
                    index={index}
                    identifier={item.id}
                    onClick={() =>
                      router.push(
                        Routes.municipalityProfile(item.municipalityId),
                      )
                    }
                    key={`tableBody-${item.id}`}
                    hasMaxWidth={false}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {error && (
        <div>
          Abbabab mistókst að sækja sveitarfélög, ertu örugglega með aðgang að
          þessu upplýsingum?
        </div>
      )}
    </LoadingContainer>
  )
}

export default Municipalities
