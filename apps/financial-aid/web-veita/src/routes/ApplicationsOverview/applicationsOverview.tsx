import React, { useEffect, useState, useContext } from 'react'
import { Text, Box, LoadingDots } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import {
  AdminLayout,
  ApplicationsTable,
  GeneratedProfile,
  GenerateName,
} from '@island.is/financial-aid-web/veita/src/components'

import {
  ApplicationState,
  getState,
  Application,
} from '@island.is/financial-aid/shared'

import format from 'date-fns/format'

import { GetApplicationsQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

import {
  navigationItems,
  calcDifferenceInDate,
  translateMonth,
  getTagByState,
} from '@island.is/financial-aid-web/veita/src/utils/formHelper'

interface ApplicationsProvider {
  applications?: Application[]
}

export interface NavigationElement {
  label: string
  link: string
  applicationState: ApplicationState[]
  headers: string[]
}

interface sortByProps {
  selected: 'modified' | 'state'
  sorted: 'asc' | 'dsc'
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

  const [sortBy, setSortBy] = useState<sortByProps>({
    selected: 'modified',
    sorted: 'asc',
  })

  if (currentNavigationItem) {
    return (
      <AdminLayout>
        <Box className={`contentUp delay-25`} key={currentNavigationItem.label}>
          <Text as="h1" variant="h1" marginBottom={[2, 2, 4]} marginTop={15}>
            {currentNavigationItem.label}
          </Text>
        </Box>
        {/* TODO: sorting & filtering should be done out side of the rendering. */}
        {data?.applications && (
          <ApplicationsTable
            className={`contentUp delay-50`}
            headers={currentNavigationItem.headers}
            setSortBy={(filter) => {
              setSortBy({ ...sortBy, selected: filter })
            }}
            sortBy={sortBy}
            applications={data.applications
              .sort((a, b) =>
                a[sortBy.selected] > b[sortBy.selected]
                  ? -1
                  : a[sortBy.selected] < b[sortBy.selected]
                  ? 1
                  : 0,
              )
              .filter((item) =>
                currentNavigationItem?.applicationState.includes(item?.state),
              )
              .map((item) => ({
                // TODO: Its kinda weird to give it all the element in props but now children.
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
                    {/* TODO: Cant we get the Iclandic name from date-fns? */}
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
          {/* TODO: "á þessari slóð?" */}
          Ekkert fundið á þessari slóð
        </Text>
      </Box>
    </div>
  )
}

export default ApplicationsOverview
