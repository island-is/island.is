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
  checkIsEditable,
  checkUseAnswersCopy,
} from '../../utils'
import { ReviewGroup } from '../../components/ReviewGroup'
import { getValueViaPath } from '@island.is/application/core'

export const CustodianOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  const useAnswersCopy = checkUseAnswersCopy(application)
  const copyPrefix = useAnswersCopy ? 'copy.' : ''

  const custodiansAnswers =
    getValueViaPath<SecondarySchoolAnswers['custodians']>(
      application.answers,
      copyPrefix + 'custodians',
    ) || []

  const custodiansExternalData = custodiansAnswers.filter(
    (x) => !!x.person?.nationalId,
  )

  const contacts = (
    getValueViaPath<SecondarySchoolAnswers['otherContacts']>(
      application.answers,
      copyPrefix + 'otherContacts',
    ) || []
  ).filter((x) => !!x.person.nationalId)

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  const totalCount = custodiansExternalData.length + contacts.length

  const isEditable = checkIsEditable(application.state)

  return (
    <ReviewGroup
      handleClick={() => onClick(Routes.CUSTODIAN)}
      editMessage={formatMessage(overview.general.editMessage)}
      title={formatMessage(
        checkHasAnyCustodians(application.externalData)
          ? overview.custodian.subtitle
          : overview.otherContact.subtitle,
      )}
      isEditable={isEditable}
    >
      <Box>
        {!!custodiansExternalData.length && (
          <GridRow>
            {custodiansExternalData.map((custodian, index) => (
              <GridColumn
                key={custodian.person?.nationalId}
                span={custodiansExternalData.length > 1 ? '1/2' : '1/1'}
              >
                {totalCount > 1 && (
                  <Text variant="h5">
                    {`${formatMessage(overview.custodian.label)} ${
                      custodiansExternalData.length > 1 ? index + 1 : ''
                    }`}
                  </Text>
                )}
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
          </GridRow>
        )}

        {!!contacts.length && (
          <GridRow marginTop={3}>
            {contacts.map((contact, index) => (
              <GridColumn
                key={contact.person?.nationalId}
                span={contacts.length > 1 ? '1/2' : '1/1'}
              >
                {totalCount > 1 && (
                  <Text variant="h5">
                    {`${formatMessage(overview.otherContact.label)} ${
                      contacts.length > 1 ? index + 1 : ''
                    }`}
                  </Text>
                )}
                <Text>{contact?.person?.name}</Text>
                <Text>{formatKennitala(contact?.person?.nationalId)}</Text>
                <Text>
                  {formatMessage(overview.otherContact.phoneLabel)}:{' '}
                  {formatPhoneNumber(contact?.person?.phone)}
                </Text>
                <Text>{contact?.person?.email}</Text>
              </GridColumn>
            ))}
          </GridRow>
        )}
      </Box>
    </ReviewGroup>
  )
}
