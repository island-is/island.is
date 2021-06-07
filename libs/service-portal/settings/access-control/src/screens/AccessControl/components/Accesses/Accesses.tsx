import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { defineMessage } from 'react-intl'

import {
  Box,
  SkeletonLoader,
  GridRow,
  GridColumn,
  Button,
} from '@island.is/island-ui/core'
import { EmptyState } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'

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
  const { pathname } = useLocation()
  const history = useHistory()
  const { formatMessage } = useLocale()

  const loading = false

  return (
    <Box>
      <GridRow>
        <GridColumn paddingBottom={4} span="12/12">
          <Box display="flex" justifyContent="flexEnd">
            <Button onClick={() => history.push(`${pathname}/veita`)}>
              {formatMessage({
                id: 'service.portal.settings.accessControl:home-grant-access',
                defaultMessage: 'Veita aðgang',
              })}
            </Button>
          </Box>
        </GridColumn>
        <GridColumn paddingBottom={4} span="12/12">
          {loading ? (
            <SkeletonLoader width="100%" height={206} />
          ) : accesses.length === 0 ? (
            <EmptyState
              title={defineMessage({
                id: 'service.portal.settings.accessControl:home-no-data',
                defaultMessage: 'Engin gögn fundust',
              })}
            />
          ) : (
            accesses.map((item, index) => (
              <AccessCard
                key={index}
                title={item.title}
                created={item.created}
                description={item.nationalId}
                tags={item.permissions}
                href={`${pathname}/${item.id}`}
                group="Ísland.is"
              />
            ))
          )}
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default Accesses
