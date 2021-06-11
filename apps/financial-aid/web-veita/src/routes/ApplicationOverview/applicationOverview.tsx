import React, { useEffect, useState, useContext, useReducer } from 'react'
import { Logo, Text, Box, Button } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import {
  AdminLayout,
  ApplicationTable,
  GeneratedProfile,
  GenerateName,
} from '../../components'

import * as styles from './applicationOverview.treat'
import cn from 'classnames'

import { useQuery, useMutation } from '@apollo/client'
import { GetApplicationQuery } from '../../../graphql/sharedGql'

import {
  Application,
  UpdateApplication,
  State,
  getState,
} from '@island.is/financial-aid/shared'

import format from 'date-fns/format'

import {
  navLinks,
  calcDifferenceInDate,
  translateMonth,
} from '../../utils/formHelper'

import { ApplicationsContext } from '../../components/ApplicationsProvider/ApplicationsProvider'

interface ApplicationData {
  applications: Application[]
}

interface NavigationLinks {
  label?: string
  link?: string
  state?: State
  secState?: State
  headers?: string[]
}

const ApplicationOverview = () => {
  const router = useRouter()

  const { applications } = useContext(ApplicationsContext)
  //WIP
  const [currentState, setState] = useState<any>(
    navLinks('link', router.pathname),
  )

  useEffect(() => {
    setState(navLinks('link', router.pathname))
  }, [router.pathname])

  return (
    <AdminLayout>
      <Box className={`contentUp delay-25`} key={currentState?.label}>
        <Text as="h1" variant="h1" marginBottom={[2, 2, 4]} marginTop={4}>
          {currentState?.label}
        </Text>
      </Box>

      {applications && (
        <ApplicationTable
          className={`contentUp delay-50`}
          header={currentState?.headers}
          applications={applications
            .filter((item) => currentState?.state.includes(item?.state))
            .map((item) => {
              return {
                arr: [
                  <Box display="flex" alignItems="center">
                    <GeneratedProfile size={32} />
                    <Box marginLeft={2}>
                      <Text variant="h5">{GenerateName(item.nationalId)}</Text>
                    </Box>
                  </Box>,
                  <Text>Ný umsókn</Text>,
                  <Text> {calcDifferenceInDate(item.modified)}</Text>,
                  <Text>
                    {translateMonth(format(new Date(item.created), 'M'))}
                  </Text>,
                ],
                link: item.id,
              }
            })}
        />
      )}
    </AdminLayout>
  )
}

export default ApplicationOverview
