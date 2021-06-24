import React, { useEffect, useState, useContext } from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import {
  AdminLayout,
  ApplicationsTable,
  GeneratedProfile,
  GenerateName,
} from '../../components'

import { ApplicationState, getState } from '@island.is/financial-aid/shared'

import format from 'date-fns/format'

import {
  navigationElements,
  calcDifferenceInDate,
  translateMonth,
  getTagByState,
} from '../../utils/formHelper'

import { ApplicationsContext } from '../../components/ApplicationsProvider/ApplicationsProvider'

export interface NavigationElement {
  label: string
  link: string
  applicationState: ApplicationState[]
  headers: string[]
}

export const ApplicationsOverview = () => {
  const router = useRouter()

  const { applications } = useContext(ApplicationsContext)

  const findCurrentNavigationEl = navigationElements.find(
    (i) => i.link === router.pathname,
  )

  if (findCurrentNavigationEl) {
    const [
      currentNavigationEl,
      setCurrentNavigationEl,
    ] = useState<NavigationElement>(findCurrentNavigationEl)

    useEffect(() => {
      setCurrentNavigationEl(findCurrentNavigationEl)
    }, [router.pathname])

    return (
      <AdminLayout>
        <Box className={`contentUp delay-25`} key={currentNavigationEl.label}>
          <Text as="h1" variant="h1" marginBottom={[2, 2, 4]} marginTop={4}>
            {currentNavigationEl.label}
          </Text>
        </Box>

        {applications && (
          <ApplicationsTable
            className={`contentUp delay-50`}
            key={currentNavigationEl.link}
            header={currentNavigationEl.headers}
            applications={applications
              .filter((item) =>
                currentNavigationEl?.applicationState.includes(item?.state),
              )
              .map((item) => ({
                listElement: [
                  <Box display="flex" alignItems="center">
                    <GeneratedProfile size={32} />
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
                    {translateMonth(format(new Date(item.created), 'M'))}
                  </Text>,
                ],
                link: item.id,
              }))}
          />
        )}
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
