import React, { useEffect, useState, useContext, useReducer } from 'react'
import { Logo, Text, Box, Button, Divider } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

import * as styles from './application.treat'
import cn from 'classnames'

import { useQuery } from '@apollo/client'
import { GetApplicationQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'
import { Application } from '@island.is/financial-aid/shared'

import {
  AdminLayout,
  ApplicationTable,
  GeneratedProfile,
  GenerateName,
  Profile,
} from '../../components'

interface ApplicationData {
  applications: Application[]
}

const ApplicationProfile = () => {
  const router = useRouter()

  const applicationArr = [
    {
      title: 'Tímabil',
      content: 'Maí 2019',
    },
    {
      title: 'Sótt um',
      content: '29.04.2021 · 14:31',
    },
    {
      title: 'Sótt um',
      content: '198.900 kr.',
    },
  ]

  const applicant = [
    {
      title: 'Nafn',
      content: 'Árni Stefánsson',
    },
    {
      title: 'Aldur',
      content: '41 árs',
    },
    {
      title: 'Kennitala',
      content: '010178 - 2299',
    },
    {
      title: '',
      content: '',
    },
    {
      title: 'Netfang',
      content: 'arnid@gmail.com',
    },
    {
      title: 'Sími',
      content: '822 - 2382',
    },
    {
      title: 'Bankareikningur',
      content: '565-26-8841',
    },
    {
      title: 'Nota persónuafslátt',
      content: 'Já',
    },
  ]

  const applicantMoreInfo = [
    {
      title: 'Lögheimili',
      content: 'Hafnarstræti 10',
    },
    {
      title: 'Póstnúmer',
      content: '220',
    },
    {
      title: 'Maki',
      content: 'Já',
    },
    {
      title: 'Fjöldi barna',
      content: '0',
    },
    {
      title: 'Búsetuform',
      content: 'Ég bý eða leigi hjá öðrum án leigusamnings',
    },
    {
      title: 'Atvinna',
      content: 'Ekkert að ofan lýsir mínum aðstæðum',
      other: 'Ég var í skóla en flosnaði úr námi',
    },
    {
      title: 'Hefur haft tekjur',
      content: 'Nei',
    },
    {
      title: 'Ríkisfang',
      content: 'Ísland',
    },
  ]

  return (
    <div className="">
      <AdminLayout>
        <Box>
          <Button
            colorScheme="default"
            iconType="filled"
            onClick={() => {
              router.push('/')
            }}
            preTextIcon="arrowBack"
            preTextIconType="filled"
            size="small"
            type="button"
            variant="text"
          >
            Í vinnslu
          </Button>
        </Box>

        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          width="full"
          paddingY={3}
        >
          <Box display="flex" alignItems="center">
            <GeneratedProfile size={48} />
            <Text as="h2" variant="h1">
              Þröskuldur Húfa
            </Text>
          </Box>

          <Button
            colorScheme="default"
            icon="pencil"
            iconType="filled"
            onClick={function noRefCheck() {}}
            preTextIconType="filled"
            size="default"
            type="button"
            variant="primary"
          >
            Ný umsókn
          </Button>
        </Box>

        <Box width="full" marginBottom={4}>
          <Divider />
        </Box>
        <Box display="flex" marginBottom={8}>
          <Box marginRight={1}>
            <Text variant="small" fontWeight="semiBold" color="dark300">
              Aldur umsóknar
            </Text>
          </Box>
          <Text variant="small">3 mín</Text>
        </Box>

        <Profile heading="Umsókn" info={applicationArr} />
        <Profile heading="Umsækjandi" info={applicant} />
        <Profile heading="Aðrar upplýsingar" info={applicantMoreInfo} />
      </AdminLayout>
    </div>
  )
}

export default ApplicationProfile
