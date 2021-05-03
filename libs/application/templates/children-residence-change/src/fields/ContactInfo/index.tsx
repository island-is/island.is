import React from 'react'
import { useIntl } from 'react-intl'
import { useFormContext } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { contactInfo } from '../../lib/messages'
import {
  childrenResidenceInfo,
  getSelectedChildrenFromExternalData,
} from '../../lib/utils'
import { CRCFieldBaseProps } from '../../types'
import { DescriptionText, InfoBanner } from '../components'

const emailId = 'parentA.email'
const phoneNumberId = 'parentA.phoneNumber'

const counterPartyEmail = 'counterParty.email'
const counterPartyPhoneNumber = 'counterParty.phoneNumber'

export const contactInfoIds = [
  emailId,
  phoneNumberId,
  counterPartyEmail,
  counterPartyPhoneNumber,
]

const ContactInfo = ({ errors, application }: CRCFieldBaseProps) => {
  const { answers, externalData } = application
  const { userProfile, nationalRegistry } = externalData
  const { formatMessage } = useIntl()
  const { clearErrors } = useFormContext()
  const emailError = errors?.parentA?.email
  const phoneNumberError = errors?.parentA?.phoneNumber
  const counterPartyError =
    typeof errors?.counterParty === 'string' ? errors.counterParty : undefined
  const counterPartyEmailError = errors?.counterParty?.email
  const counterPartyPhoneError = errors?.counterParty?.phoneNumber
  const applicant = nationalRegistry.data
  const selectedChildren = getSelectedChildrenFromExternalData(
    applicant.children,
    answers.selectedChildren,
  )

  return (
    <>
      <Box marginTop={3}>
        <DescriptionText text={contactInfo.general.description} />
      </Box>
      <Text marginTop={5} variant="h4">
        {applicant.fullName}
      </Text>
      <GridContainer>
        <GridRow marginTop={2}>
          <GridColumn span={['1/1', '1/1', '1/2']} paddingBottom={[2, 2, 0]}>
            <InputController
              id={emailId}
              name={emailId}
              backgroundColor="blue"
              type="email"
              label={formatMessage(contactInfo.inputs.emailLabel)}
              error={emailError}
              defaultValue={answers?.parentA?.email || userProfile?.data?.email}
              onChange={() => {
                clearErrors(emailId)
              }}
            />
          </GridColumn>
          <GridColumn span={['1/1', '1/1', '1/2']}>
            <InputController
              id={phoneNumberId}
              name={phoneNumberId}
              backgroundColor="blue"
              type="tel"
              label={formatMessage(contactInfo.inputs.phoneNumberLabel)}
              error={phoneNumberError}
              format="###-####"
              onChange={() => {
                clearErrors(phoneNumberId)
              }}
              defaultValue={
                answers?.parentA?.phoneNumber ||
                userProfile?.data?.mobilePhoneNumber
              }
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
      <Text marginTop={5} variant="h4">
        {selectedChildren[0].otherParent.fullName}
      </Text>
      <GridContainer>
        <GridRow marginTop={2}>
          <GridColumn span={['1/1', '1/1', '1/2']} paddingBottom={[2, 2, 0]}>
            <InputController
              id={counterPartyEmail}
              name={counterPartyEmail}
              backgroundColor="blue"
              type="email"
              label={formatMessage(contactInfo.inputs.emailLabel)}
              error={counterPartyError || counterPartyEmailError}
              defaultValue={answers?.counterParty?.email || ''}
              onChange={() => {
                clearErrors([counterPartyEmail, 'counterParty'])
              }}
            />
          </GridColumn>
          <GridColumn span={['1/1', '1/1', '1/2']}>
            <InputController
              id={counterPartyPhoneNumber}
              name={counterPartyPhoneNumber}
              backgroundColor="blue"
              type="tel"
              label={formatMessage(contactInfo.inputs.phoneNumberLabel)}
              error={counterPartyError ? '' : counterPartyPhoneError}
              format="###-####"
              onChange={() => {
                clearErrors([counterPartyPhoneNumber, 'counterParty'])
              }}
              defaultValue={answers?.counterParty?.phoneNumber || ''}
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
      <Box marginTop={3}>
        <InfoBanner>
          <Text variant="small">
            {formatMessage(contactInfo.counterParty.info)}
          </Text>
        </InfoBanner>
      </Box>
    </>
  )
}

export default ContactInfo
