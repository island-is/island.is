import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import {
  Accordion,
  AccordionItem,
  Box,
  GridColumn,
  GridRow,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { ConnectedComponent, Query } from '@island.is/web/graphql/schema'

import { GET_PHARMACIES } from './queries'
import { m } from './translation.strings'

interface Props {
  slice: ConnectedComponent
}

const PharmaciesAccordion = ({ slice }: Props) => {
  const { formatMessage } = useIntl()
  const { data, error } = useQuery<Query>(GET_PHARMACIES, {
    onError(error) {
      console.error('Error fetching pharmacies:', error)
    },
  })

  if (error) {
    return null
  }

  const pharmacies = data?.icelandicMedicinesAgencyPharmacies?.data ?? []

  return (
    <Accordion>
      {pharmacies.map((pharmacy) => (
        <AccordionItem key={pharmacy.id} id={pharmacy.id} label={pharmacy.name}>
          <GridRow rowGap={3}>
            <GridColumn span={['1/1', '1/2']}>
              <Stack space={2}>
                {pharmacy.address && (
                  <Box>
                    <Text variant="eyebrow">{formatMessage(m.address)}</Text>
                    <Text>{pharmacy.address}</Text>
                  </Box>
                )}
                {(pharmacy.postalCode || pharmacy.city) && (
                  <Box>
                    <Text variant="eyebrow">
                      {formatMessage(m.postalAddress)}
                    </Text>
                    <Text>
                      {[pharmacy.postalCode, pharmacy.city]
                        .filter(Boolean)
                        .join(' ')}
                    </Text>
                  </Box>
                )}
                {pharmacy.phone && (
                  <Box>
                    <Text variant="eyebrow">{formatMessage(m.phone)}</Text>
                    <LinkV2
                      href={`tel:${pharmacy.phone}`}
                      color="blue600"
                      underlineVisibility="hover"
                      underline="small"
                    >
                      {pharmacy.phone}
                    </LinkV2>
                  </Box>
                )}
                {pharmacy.email && (
                  <Box>
                    <Text variant="eyebrow">{formatMessage(m.email)}</Text>
                    <LinkV2
                      href={`mailto:${pharmacy.email}`}
                      color="blue600"
                      underlineVisibility="hover"
                      underline="small"
                    >
                      {pharmacy.email}
                    </LinkV2>
                  </Box>
                )}
              </Stack>
            </GridColumn>
            <GridColumn span={['1/1', '1/2']}>
              <Stack space={3}>
                {pharmacy.licenseHolder && (
                  <Box>
                    <Text variant="eyebrow">
                      {formatMessage(m.licenseHolder)}
                    </Text>
                    <Text>{pharmacy.licenseHolder}</Text>
                  </Box>
                )}
                {pharmacy.operator && (
                  <Box>
                    <Text variant="eyebrow">{formatMessage(m.operator)}</Text>
                    <Stack space={0}>
                      {pharmacy.operator.name && (
                        <Text>{pharmacy.operator.name}</Text>
                      )}
                      {pharmacy.operator.address && (
                        <Text>{pharmacy.operator.address}</Text>
                      )}
                      {(pharmacy.operator.postalCode ||
                        pharmacy.operator.city) && (
                        <Text>
                          {[
                            pharmacy.operator.postalCode,
                            pharmacy.operator.city,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        </Text>
                      )}
                      {pharmacy.operator.nationalId && (
                        <Text>
                          {formatMessage(m.nationalIdPrefix)}{' '}
                          {pharmacy.operator.nationalId}
                        </Text>
                      )}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </GridColumn>
          </GridRow>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default PharmaciesAccordion
