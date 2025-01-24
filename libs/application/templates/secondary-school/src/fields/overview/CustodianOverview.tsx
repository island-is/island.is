import {
  FieldBaseProps,
  NationalRegistryParent,
} from '@island.is/application/types'
import { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { SecondarySchoolAnswers } from '../..'
import { overview } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { formatKennitala, formatPhoneNumber, Routes, States } from '../../utils'
import { ReviewGroup } from '../../components/ReviewGroup'
import { getValueViaPath } from '@island.is/application/core'

export const CustodianOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  const custodians =
    getValueViaPath<NationalRegistryParent[]>(
      application.externalData,
      'nationalRegistryCustodians.data',
    ) || []

  const custodiansAnswers =
    getValueViaPath<SecondarySchoolAnswers['custodians']>(
      application.answers,
      'custodians',
    ) || []

  const mainOtherContact = getValueViaPath<
    SecondarySchoolAnswers['mainOtherContact']
  >(application.answers, 'mainOtherContact')

  const otherContacts = (
    getValueViaPath<SecondarySchoolAnswers['otherContacts']>(
      application.answers,
      'otherContacts',
    ) || []
  ).filter((x) => !!x.person.nationalId)

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  const hasCustodian = !!custodians[0]
  const showMainOtherContact = !!mainOtherContact?.nationalId
  const showOtherContacts = !!otherContacts.length

  return (
    <ReviewGroup
      handleClick={() => onClick(Routes.CUSTODIAN)}
      editMessage={formatMessage(overview.general.editMessage)}
      title={formatMessage(
        hasCustodian
          ? overview.custodian.subtitle
          : overview.otherContact.subtitle,
      )}
      isEditable={application.state === States.DRAFT}
    >
      <Box>
        {!!custodians.length && (
          <GridRow>
            {custodians.map((custodian, index) => (
              <GridColumn span="1/2">
                <Text variant="h5">
                  {formatMessage(overview.custodian.subtitle)}{' '}
                  {custodians.length > 1 ? index + 1 : ''}
                </Text>
                <Text>
                  {custodian.givenName} {custodian.familyName}
                </Text>
                <Text>{formatKennitala(custodian.nationalId)}</Text>
                <Text>{custodian.legalDomicile?.streetAddress}</Text>
                <Text>
                  {custodian.legalDomicile?.postalCode}{' '}
                  {custodian.legalDomicile?.locality}
                </Text>
                <Text>
                  {formatMessage(overview.custodian.phoneLabel)}:{' '}
                  {formatPhoneNumber(custodiansAnswers[index]?.phone)}
                </Text>
                <Text>{custodiansAnswers[index]?.email}</Text>
              </GridColumn>
            ))}
            {custodians.length % 2 !== 0 && (
              <GridColumn span="1/2"></GridColumn>
            )}
          </GridRow>
        )}

        {(showMainOtherContact || showOtherContacts) && (
          <GridRow marginTop={3}>
            {showMainOtherContact && (
              <GridColumn span={showOtherContacts ? '1/2' : '1/1'}>
                <Text variant="h5">
                  {formatMessage(overview.otherContact.label)}{' '}
                  {otherContacts.length > 0 ? '1' : ''}
                </Text>
                <Text>{mainOtherContact.name}</Text>
                <Text>{formatKennitala(mainOtherContact.nationalId)}</Text>
                <Text>
                  {formatMessage(overview.otherContact.phoneLabel)}:{' '}
                  {formatPhoneNumber(mainOtherContact.phone)}
                </Text>
                <Text>{mainOtherContact.email}</Text>
              </GridColumn>
            )}
            {showOtherContacts &&
              otherContacts.map((otherContact, index) => (
                <GridColumn span="1/2">
                  <Text variant="h5">
                    {formatMessage(overview.otherContact.label)}{' '}
                    {mainOtherContact?.nationalId ? index + 2 : ''}
                  </Text>
                  <Text>{otherContact.person.name}</Text>
                  <Text>{formatKennitala(otherContact.person.nationalId)}</Text>
                  <Text>
                    {formatMessage(overview.otherContact.phoneLabel)}:{' '}
                    {formatPhoneNumber(otherContact.phone)}
                  </Text>
                  <Text>{otherContact.email}</Text>
                </GridColumn>
              ))}
          </GridRow>
        )}
      </Box>
    </ReviewGroup>
  )
}
