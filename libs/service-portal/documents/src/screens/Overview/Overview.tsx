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
import { Query, QueryGetDocumentArgs } from '@island.is/api/schema'

export const ServicePortalDocuments = () => {
  const { data, loading, error } = useQuery<Query, QueryGetDocumentArgs>(
    GET_DOCUMENT,
    {
      variables: {
        input: {
          id: '12456',
        },
      },
    },
  )
  const document = data?.getDocument
  console.log(document?.id)
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
        <Box marginTop={[1, 1, 2, 2, 6]}>
          {loading && <SkeletonLoader height={147} repeat={4} space={2} />}
          {error && (
            <Typography variant="h3">
              Tókst ekki að sækja rafræn skjöl, eitthvað fór úrskeiðis
            </Typography>
          )}
        </Box>
      </Stack>
    </>
  )
}

export default ServicePortalDocuments
