import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { SecondarySchoolAnswers } from '../..'
import { overview } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { formatKennitala, formatPhoneNumber, getParent } from '../../utils'

export const CustodianOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as SecondarySchoolAnswers

  const parent1 = getParent(application.externalData, 0)
  const parent2 = getParent(application.externalData, 1)

  return (
    <Box paddingBottom={4} paddingTop={4}>
      <GridRow>
        {parent1 && (
          <GridColumn span="1/2">
            <Text variant="h4">
              {formatMessage(overview.custodian.subtitle)} 1:
            </Text>
            <Text>
              {parent1?.givenName} {parent1?.familyName}
            </Text>
            <Text>{formatKennitala(parent1?.nationalId)}</Text>
            <Text>{parent1?.legalDomicile?.streetAddress}</Text>
            <Text>
              {parent1?.legalDomicile?.postalCode}{' '}
              {parent1?.legalDomicile?.locality}
            </Text>
            <Text>
              {formatMessage(overview.custodian.phoneLabel)}:{' '}
              {formatPhoneNumber(answers?.custodians[0]?.phone)}
            </Text>
            <Text>{answers?.custodians[0]?.email}</Text>
          </GridColumn>
        )}
        {parent2 && (
          <GridColumn span="1/2">
            <Text variant="h4">
              {formatMessage(overview.custodian.subtitle)} 1:
            </Text>
            <Text>
              {parent2?.givenName} {parent2?.familyName}
            </Text>
            <Text>{formatKennitala(parent2?.nationalId)}</Text>
            <Text>{parent2?.legalDomicile?.streetAddress}</Text>
            <Text>
              {parent2?.legalDomicile?.postalCode}{' '}
              {parent2?.legalDomicile?.locality}
            </Text>
            <Text>
              {formatMessage(overview.custodian.phoneLabel)}:{' '}
              {formatPhoneNumber(answers?.custodians[1]?.phone)}
            </Text>
            <Text>{answers?.custodians[1]?.email}</Text>
          </GridColumn>
        )}
        {parent1 && !parent2 && <GridColumn span="1/2"></GridColumn>}
      </GridRow>

      {answers?.otherContact?.include && (
        <GridRow marginTop={3}>
          <GridColumn span="1/2">
            <Text variant="h4">
              {formatMessage(overview.otherContact.subtitle)}:
            </Text>
            <Text>{answers.otherContact.name}</Text>
            <Text>{formatKennitala(answers.otherContact.nationalId)}</Text>
            <Text>
              {formatMessage(overview.otherContact.phoneLabel)}:{' '}
              {formatPhoneNumber(answers.otherContact.phone)}
            </Text>
            <Text>{answers.otherContact.email}</Text>
          </GridColumn>
          <GridColumn span="1/2"></GridColumn>
        </GridRow>
      )}
    </Box>
  )
}
