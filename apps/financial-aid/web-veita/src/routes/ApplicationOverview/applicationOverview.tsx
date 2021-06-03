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

import { useQuery } from '@apollo/client'
import {
  GetApplicationQuery,
  GetCurrentUserQuery,
} from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import { Application } from '@island.is/financial-aid/shared'

interface ApplicationData {
  applications: Application[]
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
      link: '/',
      headers: ['Nafn', 'Staða', 'Tími án umsjár'],
    },
    {
      label: 'Í vinnslu',
      link: '/vinnslu',
      headers: ['Nafn', 'Staða', 'Síðast uppfært', 'Tímabil'],
    },
    {
      label: 'Afgreidd mál',
      link: '/afgreidd',
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
    <>
      <Text as="h1" variant="h1" marginBottom={[4, 4, 6]}>
        {currentState.label}
      </Text>
      {data?.applications && (
        <ApplicationTable
          header={currentState.headers}
          applications={data.applications.map((item) => {
            return {
              arr: [
                <Box display="flex" alignItems="center">
                  <GeneratedProfile size={32} />
                  <Text variant="h5">{GenerateName(item.nationalId)}</Text>
                </Box>,
                <Text>Ný umsókn</Text>,
                <Text>2klst</Text>,
              ],
              link: item.id,
            }
          })}
        />
      )}
    </>
  )
}

export default ApplicationOverview
