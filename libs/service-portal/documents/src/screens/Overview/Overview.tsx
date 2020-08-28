import React from 'react'
import {
  Typography,
  Box,
  Stack,
  Columns,
  Column,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import { GET_DOCUMENT } from '@island.is/service-portal/graphql'

export const ServicePortalDocuments = () => {
  const { data } = useQuery(GET_DOCUMENT, {
    variables: {
      input: {
        id: '12456',
      },
    },
  })

  return (
    <>
      <Stack space={3}>
        <Typography variant="h1" as="h1">
          Rafræn skjöl
        </Typography>
        <Columns collapseBelow="sm">
          <Column width="7/12">
            <Typography variant="intro">
              Hér getur þú fundið öll þau skjöl sem eru send til þín frá
              stofnunum ríkisins.
            </Typography>
          </Column>
        </Columns>
        <SkeletonLoader height={147} repeat={4} />
      </Stack>
    </>
  )
}

export default ServicePortalDocuments
