import React, { useContext, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GetApplicationQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'
import { Application } from '@island.is/financial-aid/shared'
import { Logo, Text, Box, Button } from '@island.is/island-ui/core'
import {
  AdminLayout,
  ApplicationTable,
  GeneratedProfile,
  GenerateName,
  Profile,
} from '../src/components'

interface ApplicationData {
  applications: Application[]
}

const Index = () => {
  const info = [
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
  return (
    <div className="">
      <AdminLayout>
        <Box>
          <Button
            colorScheme="default"
            iconType="filled"
            onClick={function noRefCheck() {}}
            preTextIcon="arrowBack"
            preTextIconType="filled"
            size="default"
            type="button"
            variant="text"
          >
            Text with icon
          </Button>
        </Box>

        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          width="full"
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

        <Profile heading="Umsókn" info={info} />
        <Profile heading="Umsækjandi" info={info} />
      </AdminLayout>
    </div>
  )
}

export default Index
