import React from 'react'
import { defineMessage } from 'react-intl'

import { Box, Button, SkeletonLoader } from '@island.is/island-ui/core'
import { EmptyState } from '@island.is/service-portal/core'

import { AccessCard } from '../AccessCard'

// TODO: query from graphql
const accesses = [
  {
    title: 'Starfsmaður á plani',
    nationalId: '0123456789',
    created: '23.04.2020',
    id: '467',
    permissions: ['Umsóknir'],
  },
]

function Accesses(): JSX.Element {
  const loading = false
  if (loading) {
    return <SkeletonLoader width="100%" height={158} />
  } else if (accesses.length === 0) {
    return (
      <Box marginTop={8}>
        <EmptyState
          title={defineMessage({
            id: 'service.portal:accesses-no-data',
            defaultMessage: 'Engin gögn fundust',
          })}
        />
      </Box>
    )
  }

  return (
    <>
      {accesses.map((item, index) => (
        <AccessCard
          key={index}
          title={item.title}
          created={item.created}
          description={item.nationalId}
          tags={item.permissions}
          href={`/${item.id}`}
          group="Ísland.is"
        />
      ))}
    </>
  )
}

export default Accesses
