import React, { useState } from 'react'
import {
  ServicePortalModuleComponent,
  m,
  EmptyState,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import {
  Box,
  Stack,
  Text,
  GridColumn,
  GridRow,
  Input,
  Button,
  Divider,
} from '@island.is/island-ui/core'
import { messages } from '../../lib/messages'
import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { GET_USERS_VEHICLES_SEARCH_LIMIT } from '../../queries/getUsersVehicleSearchLimit'

export const Lookup: ServicePortalModuleComponent = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [limit, setLimit] = useState<number>()
  const [searchValue, setSearchValue] = useState('')

  const { data: searchLimitData, loading, error } = useQuery<Query>(
    GET_USERS_VEHICLES_SEARCH_LIMIT,
  )

  if (!loading && searchLimitData && !limit) {
    const limit = searchLimitData.vehiclesSearchLimit || 0
    setLimit(limit)
  }

  if (error) {
    return (
      <Box>
        <EmptyState description={m.errorFetch} />
      </Box>
    )
  }

  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={3}>
              <Text variant="h3" as="h1">
                {formatMessage(messages.vehiclesLookup)}
              </Text>
              <Text as="p" variant="default">
                {formatMessage({
                  id: 'sp.vehicles:vehicles-lookup-intro',
                  defaultMessage: `Þú getur flett upp allt að 5 ökutækjum á dag.`,
                })}
              </Text>

              <Text variant="h5">
                {formatMessage({
                  id: 'sp.vehicles:vehicles-lookup-terms-title',
                  defaultMessage: `Skilmálar fyrir leit í ökutækjaskrá`,
                })}
              </Text>
              <Text as="p" variant="small">
                {formatMessage({
                  id: 'sp.vehicles:vehicles-lookup-terms-intro',
                  defaultMessage: `Við uppflettingu í og vinnslu upplýsinga úr ökutækjaskrá skal farið eftir lögum um persónuvernd og meðferð persónuupplýsinga.
                  Vakin er athygli á að uppflettingar upplýsinga í ökutækjaskrá eru færðar í aðgerðaskrár (log –skrár).
                  Þeim er flettir upp er heimilt að skrá upplýsingar úr ökutækjaskrá í eigið kerfi eftir því sem við á en óheimilt að safna þeim í sérstakan gagnagrunn yfir ökutæki.
                  Óheimilt er að breyta upplýsingum úr ökutækjaskrá.
                  Sá er flettir upp er aðeins heimilt að nota upplýsingarnar í eigin þágu. Óheimilt er að miðla upplýsingum úr ökutækjaskrá til þriðja aðila eða birta þær opinberlega nema að því leyti sem það getur talist eðlilegur þáttur í starfsemi viðtakanda. Persónuupplýsingar má þó aldrei birta opinberlega.`,
                })}
              </Text>
              <Button
                size="small"
                onClick={() => setTermsAccepted(true)}
                icon={termsAccepted ? 'checkmark' : undefined}
              >
                {' '}
                {!termsAccepted
                  ? formatMessage({
                      id: 'sp.vehicles:vehicles-lookup-terms-button',
                      defaultMessage: `Samþykkja skilmála`,
                    })
                  : formatMessage({
                      id: 'sp.vehicles:vehicles-lookup-terms-accepted',
                      defaultMessage: `Þú hefur samþykkt skilmála`,
                    })}
              </Button>

              <Divider />
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
            <Box
              display="flex"
              flexDirection={['column', 'column', 'row']}
              alignItems={['flexStart', 'flexStart', 'flexEnd']}
            >
              <Input
                icon="search"
                backgroundColor="blue"
                size="xs"
                value={searchValue}
                onChange={(ev) => setSearchValue(ev.target.value)}
                name="uppfletting-okutaekjaskra-leit"
                label={formatMessage({
                  id: 'sp.vehicles:vehicles-lookup-label',
                  defaultMessage: `Uppfletting ökutækis`,
                })}
                placeholder={formatMessage({
                  id: 'sp.vehicles:vehicles-lookup-placeholder',
                  defaultMessage: `Leita.`,
                })}
                disabled={!termsAccepted}
              />
              <Box marginLeft={[0, 0, 3]} marginTop={[2, 2, 0]}>
                <Button
                  disabled={!termsAccepted}
                  variant="ghost"
                  size="small"
                  onClick={() => console.log('search')}
                >
                  {formatMessage({
                    id: 'sp.vehicles:vehicles-lookup-search',
                    defaultMessage: `Leita`,
                  })}{' '}
                  {' ('}
                  {limit}
                  {')'}
                </Button>
              </Box>
            </Box>
          </GridColumn>
        </GridRow>
      </Stack>
    </>
  )
}

export default Lookup
