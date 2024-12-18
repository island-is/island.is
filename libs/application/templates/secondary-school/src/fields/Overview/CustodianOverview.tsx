import {
  FieldBaseProps,
  NationalRegistryParent,
} from '@island.is/application/types'
import { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { SecondarySchoolAnswers } from '../..'
import { overview } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { formatKennitala, formatPhoneNumber } from '../../utils'
import { ReviewGroup } from '../../components/ReviewGroup'
import { Routes, States } from '../../lib/constants'
import { getValueViaPath } from '@island.is/application/core'

export const CustodianOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  const parents =
    getValueViaPath<NationalRegistryParent[]>(
      application.externalData,
      'nationalRegistryParents.data',
    ) || []

  const custodians =
    getValueViaPath<SecondarySchoolAnswers['custodians']>(
      application.answers,
      'custodians',
    ) || []

  const otherContacts = (
    getValueViaPath<SecondarySchoolAnswers['otherContacts']>(
      application.answers,
      'otherContacts',
    ) || []
  ).filter((x) => x.include)

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  return (
    <ReviewGroup
      handleClick={() => onClick(Routes.CUSTODIAN)}
      editMessage={formatMessage(overview.general.editMessage)}
      title={formatMessage(overview.custodian.subtitle)}
      isEditable={application.state === States.DRAFT}
    >
      <Box>
        {!!parents.length && (
          <GridRow>
            {parents.map((parent, index) => (
              <GridColumn span="1/2">
                <Text variant="h5">
                  {formatMessage(overview.custodian.subtitle)} {index + 1}
                </Text>
                <Text>
                  {parent.givenName} {parent.familyName}
                </Text>
                <Text>{formatKennitala(parent.nationalId)}</Text>
                <Text>{parent.legalDomicile?.streetAddress}</Text>
                <Text>
                  {parent.legalDomicile?.postalCode}{' '}
                  {parent.legalDomicile?.locality}
                </Text>
                <Text>
                  {formatMessage(overview.custodian.phoneLabel)}:{' '}
                  {formatPhoneNumber(custodians[index]?.phone)}
                </Text>
                <Text>{custodians[index]?.email}</Text>
              </GridColumn>
            ))}
            {parents.length % 2 !== 0 && <GridColumn span="1/2"></GridColumn>}
          </GridRow>
        )}

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
  )
}
