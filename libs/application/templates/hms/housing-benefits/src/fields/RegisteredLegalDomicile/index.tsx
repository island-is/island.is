import { FC } from 'react'
import { getValueViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { Box, GridColumn, GridRow, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as m from '../../lib/messages'

export const RegisteredLegalDomicile: FC<FieldBaseProps> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  const individual = getValueViaPath<NationalRegistryIndividual>(
    application.externalData,
    'nationalRegistry.data',
  )
  const address = individual?.address
  const postalCodeAndLocality = [address?.postalCode, address?.locality]
    .filter(Boolean)
    .join(' ')
  const addressLine = [address?.streetAddress, postalCodeAndLocality]
    .filter(Boolean)
    .join(', ')

  return (
    <GridRow>
      <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
        <Box
          border="standard"
          borderColor="blue200"
          borderRadius="large"
          padding={3}
          marginBottom={2}
        >
          <Box display="flex" alignItems="center" marginBottom={1}>
            <Icon icon="home" type="outline" color="blue400" />
            <Box marginLeft={1}>
              <Text variant="h4" color="blue400">
                {formatMessage(
                  m.draftMessages.legalDomicileSection.registeredDomicileTitle,
                )}
              </Text>
            </Box>
          </Box>
          {individual?.fullName && <Text>{individual.fullName}</Text>}
          {addressLine && <Text>{addressLine}</Text>}
        </Box>
      </GridColumn>
    </GridRow>
  )
}
