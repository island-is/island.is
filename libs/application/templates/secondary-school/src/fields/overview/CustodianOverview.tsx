import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { SecondarySchoolAnswers } from '../..'
import { overview } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import {
  checkHasAnyCustodians,
  formatKennitala,
  formatPhoneNumber,
  Routes,
  States,
} from '../../utils'
import { ReviewGroup } from '../../components/ReviewGroup'
import { getValueViaPath } from '@island.is/application/core'

export const CustodianOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  const custodiansAnswers =
    getValueViaPath<SecondarySchoolAnswers['custodians']>(
      application.answers,
      'custodians',
    ) || []

  const custodiansExternalData = custodiansAnswers.filter(
    (x) => !!x.person?.nationalId,
  )

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

  const showMainOtherContact = !!mainOtherContact?.person?.nationalId
  const showOtherContacts = !!otherContacts.length

  return (
    <ReviewGroup
      handleClick={() => onClick(Routes.CUSTODIAN)}
      editMessage={formatMessage(overview.general.editMessage)}
      title={formatMessage(
        checkHasAnyCustodians(application.externalData)
          ? overview.custodian.subtitle
          : overview.otherContact.subtitle,
      )}
      isEditable={application.state === States.DRAFT}
    >
      <Box>
        {!!custodiansExternalData.length && (
          <GridRow>
            {custodiansExternalData.map((custodian, index) => (
              <GridColumn span="1/2">
                <Text variant="h5">
                  {formatMessage(overview.custodian.subtitle)}{' '}
                  {custodiansExternalData.length > 1 ? index + 1 : ''}
                </Text>
                <Text>{custodian.person?.name}</Text>
                <Text>{formatKennitala(custodian.person?.nationalId)}</Text>
                <Text>{custodian.legalDomicile?.streetAddress}</Text>
                <Text>
                  {custodian.legalDomicile?.postalCode}{' '}
                  {custodian.legalDomicile?.city}
                </Text>
                <Text>
                  {formatMessage(overview.custodian.phoneLabel)}:{' '}
                  {formatPhoneNumber(custodiansAnswers[index]?.person?.phone)}
                </Text>
                <Text>{custodiansAnswers[index]?.person?.email}</Text>
              </GridColumn>
            ))}
            {custodiansExternalData.length % 2 !== 0 && (
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
                <Text>{mainOtherContact.person?.name}</Text>
                <Text>
                  {formatKennitala(mainOtherContact.person?.nationalId)}
                </Text>
                <Text>
                  {formatMessage(overview.otherContact.phoneLabel)}:{' '}
                  {formatPhoneNumber(mainOtherContact.person?.phone)}
                </Text>
                <Text>{mainOtherContact.person?.email}</Text>
              </GridColumn>
            )}
            {showOtherContacts &&
              otherContacts.map((otherContact, index) => (
                <GridColumn span="1/2">
                  <Text variant="h5">
                    {formatMessage(overview.otherContact.label)}{' '}
                    {mainOtherContact?.person?.nationalId ? index + 2 : ''}
                  </Text>
                  <Text>{otherContact.person.name}</Text>
                  <Text>{formatKennitala(otherContact.person.nationalId)}</Text>
                  <Text>
                    {formatMessage(overview.otherContact.phoneLabel)}:{' '}
                    {formatPhoneNumber(otherContact.person?.phone)}
                  </Text>
                  <Text>{otherContact.person?.email}</Text>
                </GridColumn>
              ))}
          </GridRow>
        )}
      </Box>
    </ReviewGroup>
  )
}
