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

import { calcDifferenceInDate, translateMonth } from '../../utils/formHelper'

interface ApplicationData {
  applications: Application[]
}

interface SaveData {
  applicant: Application
}

const ApplicationOverview = () => {
  const router = useRouter()

  const { data, error, loading } = useQuery<ApplicationData>(
    GetApplicationQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const navLinks = [
    {
      label: 'Ný mál',
      link: '/nymal',
      state: State.NEW,
      headers: ['Nafn', 'Staða', 'Tími án umsjár', 'Tímabil'],
    },
    {
      label: 'Í vinnslu',
      link: '/vinnslu',
      state: State.INPROGRESS,
      headers: ['Nafn', 'Staða', 'Síðast uppfært', 'Tímabil'],
    },
    {
      label: 'Afgreidd mál',
      link: '/afgreidd',
      state: State.APPROVED,
      secState: State.REJECTED,
      headers: ['Nafn', 'Staða', 'Úrlausnartími', 'Tímabil'],
    },
  ]

  const [currentState, setState] = useState(
    navLinks.filter((i) => i.link === router.pathname)[0],
  )

  useEffect(() => {
    setState(navLinks.filter((i) => i.link === router.pathname)[0])
  }, [router.pathname])

  useEffect(() => {
    document.title = 'Sveita • Umsóknir um fjárhagsaðstoð'
  }, [])

  return (
    <AdminLayout>
      <Text as="h1" variant="h1" marginBottom={[2, 2, 4]} marginTop={4}>
        {currentState?.label}
      </Text>
      {data?.applications && (
        <ApplicationTable
          header={currentState?.headers}
          applications={data.applications
            .filter(
              (item) =>
                item.state === currentState?.state ||
                item.state === currentState?.secState,
            )
            .map((item) => {
              return {
                arr: [
                  <Box display="flex" alignItems="center">
                    <GeneratedProfile size={32} />
                    <Text variant="h5">{GenerateName(item.nationalId)}</Text>
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
