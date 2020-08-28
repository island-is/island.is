import React from 'react'
import {
  Typography,
  Box,
  Stack,
  Columns,
  Column,
  SkeletonLoader,
  Button,
} from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import { GET_DOCUMENT } from '@island.is/service-portal/graphql'
import { Query, QueryGetDocumentArgs } from '@island.is/api/schema'
import { ActionMenuItem } from '@island.is/service-portal/core'
import { ActionCard } from '@island.is/service-portal/core'

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
          {document && (
            <Stack space={2}>
              {[...Array(4)].map((_key, index) => (
                <ActionCard
                  title={document.subject}
                  date={new Date(document.date)}
                  label={document.senderName}
                  text={
                    'Vottorð um skuldleysi til þess að gera grein fyrir þinni skuldarstöðu gagnvart ríkinu'
                  }
                  url="https://island.is/"
                  external
                  key={index}
                  actionMenuRender={() => (
                    <>
                      <ActionMenuItem>Fela skjal</ActionMenuItem>
                      <ActionMenuItem>Eyða skjali</ActionMenuItem>
                    </>
                  )}
                  buttonRender={() => (
                    <Button variant="ghost" size="small" leftIcon="file">
                      Sakavottorð
                    </Button>
                  )}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </>
  )
}

export default ServicePortalDocuments
