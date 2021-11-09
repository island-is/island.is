import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  TableBody,
  TableHeaders,
} from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box, Button } from '@island.is/island-ui/core'
import * as tableStyles from '../../sharedStyles/Table.css'
import * as headerStyles from '../../sharedStyles/Header.css'
import cn from 'classnames'

import { Municipality } from '@island.is/financial-aid/shared/lib'
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

  const name = (municipality: Municipality) => {
    return (
      <Box>
        <Text variant="h5" color={municipality.active ? 'dark400' : 'dark300'}>
          {municipality.name}
        </Text>
      </Box>
    )
  }

  const users = (municipality: Municipality) => {
    return (
      <Box>
        <Text color={municipality.active ? 'dark400' : 'dark300'}>
          {municipality.users}
        </Text>
      </Box>
    )
  }

  const activationButton = (municipality: Municipality) => {
    return (
      <Box>
        <Button
          onClick={(event) => {
            event.stopPropagation()
          }}
          variant="text"
          loading={false}
          colorScheme={municipality.active ? 'destructive' : 'light'}
        >
          {municipality.active ? 'Óvirkja' : 'Virkja'}
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
                      key={'tableHeaders-' + index}
                    />
                  ))}
                </tr>
              </thead>

              <tbody className={tableStyles.tableBody}>
                {municipalities.map((item: Municipality, index) => (
                  <TableBody
                    items={[name(item), users(item), activationButton(item)]}
                    index={index}
                    identifier={item.id}
                    onClick={() =>
                      router.push(`sveitarfelog/${item.municipalityId}`)
                    }
                    key={'tableBody-' + item.id}
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
