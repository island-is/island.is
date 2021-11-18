import React, { useEffect, useState } from 'react'
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
  ToastContainer,
  toast,
} from '@island.is/island-ui/core'
import * as tableStyles from '../../sharedStyles/Table.css'
import * as headerStyles from '../../sharedStyles/Header.css'
import cn from 'classnames'

import { Municipality, Routes } from '@island.is/financial-aid/shared/lib'
import {
  ActivityMunicipalityMutation,
  MunicipalitiesQuery,
  UpdateMunicipalityMutation,
} from '@island.is/financial-aid-web/veita/graphql'
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

  const [municipalities, setMunicipalities] = useState<Municipality[]>()

  useEffect(() => {
    if (data?.municipalities) {
      setMunicipalities(data.municipalities)
    }
  }, [data])

  const [activityMunicipality] = useMutation(ActivityMunicipalityMutation)

  const changeMunicipalityActivity = async (id: string, active: boolean) => {
    await activityMunicipality({
      variables: {
        input: {
          id,
          active,
        },
      },
    })
      .then(() => {
        getMunicipalities()
      })
      .catch(() => {
        toast.error(
          'Ekki tókst að uppfæra sveitarfélag, vinsamlega reynið aftur síðar',
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
                  {['Nafn', 'Notendur', 'Aðgerð'].map((item, index) => (
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
                        item.numberOfUsers,
                        item.active ? 'dark400' : 'dark300',
                      ),
                      ActivationButtonTableItem(
                        item.active ? 'Óvirkja' : 'Virkja',
                        false,
                        () => changeMunicipalityActivity(item.id, !item.active),
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
      <ToastContainer />
    </LoadingContainer>
  )
}

export default Municipalities
