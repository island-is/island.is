import React, { useEffect, useState, useContext } from 'react'
import { Text, Box, LoadingDots } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import {
  AdminLayout,
  ApplicationsTable,
  GeneratedProfile,
  GenerateName,
} from '../../components'

import {
  ApplicationState,
  getState,
  Application,
} from '@island.is/financial-aid/shared'

import format from 'date-fns/format'

import { GetApplicationsQuery } from '../../../graphql/sharedGql'

import {
  navigationItems,
  calcDifferenceInDate,
  translateMonth,
  getTagByState,
} from '../../utils/formHelper'

interface ApplicationsProvider {
  applications?: Application[]
}

export interface NavigationElement {
  label: string
  link: string
  applicationState: ApplicationState[]
  headers: string[]
}

export const ApplicationsOverview = () => {
  const router = useRouter()

  const { data, error, loading } = useQuery<ApplicationsProvider>(
    GetApplicationsQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const currentNavigationItem = navigationItems.find(
    (i) => i.link === router.pathname,
  )

  if (currentNavigationItem) {
    return (
      <AdminLayout>
        <Box className={`contentUp delay-25`} key={currentNavigationItem.label}>
          <Text as="h1" variant="h1" marginBottom={[2, 2, 4]} marginTop={4}>
            {currentNavigationItem.label}
          </Text>
        </Box>

        {data?.applications && (
          <ApplicationsTable
            className={`contentUp delay-50`}
            key={router.pathname}
            headers={currentNavigationItem.headers}
            applications={data.applications
              .filter((item) =>
                currentNavigationItem?.applicationState.includes(item?.state),
              )
              .map((item) => ({
                listElement: [
                  <Box display="flex" alignItems="center">
                    <GeneratedProfile size={32} nationalId={item.nationalId} />
                    <Box marginLeft={2}>
                      <Text variant="h5">{GenerateName(item.nationalId)}</Text>
                    </Box>
                  </Box>,
                  <Box>
                    <div className={`tags ${getTagByState(item.state)}`}>
                      {getState[item.state]}
                    </div>
                  </Box>,

                  <Text> {calcDifferenceInDate(item.modified)}</Text>,
                  <Text>
                    {translateMonth(
                      parseInt(format(new Date(item.created), 'M')),
                    )}
                  </Text>,
                ],
                link: item.id,
              }))}
          />
        )}
        {loading && <LoadingDots />}
      </AdminLayout>
    )
  }
  return (
    <div>
      <Box className={`contentUp delay-25`}>
        <Text as="h1" variant="h1" marginBottom={[2, 2, 4]} marginTop={4}>
          Ekkert fundið á þessari slóð
        </Text>
      </Box>
    </div>
  )
}

export default ApplicationsOverview
