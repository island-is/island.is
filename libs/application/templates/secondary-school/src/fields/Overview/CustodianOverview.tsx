import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { SecondarySchoolAnswers } from '../..'
import { overview } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { formatKennitala, formatPhoneNumber, getParent } from '../../utils'
import { ReviewGroup } from '../../components/ReviewGroup'
import { Routes } from '../../shared'

export const CustodianOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as SecondarySchoolAnswers

  const parent1 = getParent(application.externalData, 0)
  const parent2 = getParent(application.externalData, 1)

  const otherContacts = (answers?.otherContacts || []).filter((x) => x.include)

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  return (
    <>
      <Divider />
      <ReviewGroup
        handleClick={() => onClick(Routes.CUSTODIAN)}
        editMessage={formatMessage(overview.general.editMessage)}
        title={formatMessage(overview.custodian.subtitle)}
      >
        <Box>
          <GridRow>
            {parent1 && (
              <GridColumn span="1/2">
                <Text variant="h5">
                  {formatMessage(overview.custodian.subtitle)} 1
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
                <Text variant="h5">
                  {formatMessage(overview.custodian.subtitle)} 2
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

          {!!otherContacts.length && (
            <GridRow marginTop={3}>
              {otherContacts.map((otherContact, index) => (
                <GridColumn span="1/2">
                  <Text variant="h5">
                    {formatMessage(overview.otherContact.subtitle)}{' '}
                    {otherContacts.length > 0 ? index + 1 : ''}
                  </Text>
                  <Text>{otherContact.name}</Text>
                  <Text>{formatKennitala(otherContact.nationalId)}</Text>
                  <Text>
                    {formatMessage(overview.otherContact.phoneLabel)}:{' '}
                    {formatPhoneNumber(otherContact.phone)}
                  </Text>
                  <Text>{otherContact.email}</Text>
                </GridColumn>
              ))}
              {otherContacts.length % 2 !== 0 && (
                <GridColumn span="1/2"></GridColumn>
              )}
            </GridRow>
          )}
        </Box>
      </ReviewGroup>
    </>
  )
}
