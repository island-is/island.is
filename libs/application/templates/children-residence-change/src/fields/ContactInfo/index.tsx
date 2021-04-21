import React from 'react'
import { useIntl } from 'react-intl'
import { Controller, useFormContext } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { contactInfo } from '../../lib/messages'
import { childrenResidenceInfo } from '../../lib/utils'
import { CRCFieldBaseProps } from '../../types'

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
  const counterPartyError = (errors?.counterParty as unknown) as string
  const isCounterPartyError = typeof counterPartyError === 'string'
  const counterPartyEmailError = errors?.counterParty?.email
  const counterPartyPhoneError = errors?.counterParty?.phoneNumber
  const applicant = nationalRegistry.data
  const childResidenceInfo = childrenResidenceInfo(applicant, answers)

  return (
    <>
      <Text marginTop={3}>
        {formatMessage(contactInfo.general.description)}
      </Text>
      <Text marginTop={5} variant="h4">
        {childResidenceInfo.current.parentName}
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
        {childResidenceInfo.future.parentName}
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
              error={
                isCounterPartyError ? counterPartyError : counterPartyEmailError
              }
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
              error={isCounterPartyError ? '' : counterPartyPhoneError}
              format="###-####"
              onChange={() => {
                clearErrors([counterPartyPhoneNumber, 'counterParty'])
              }}
              defaultValue={answers?.counterParty?.phoneNumber || ''}
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
      <Box
        marginTop={3}
        padding={2}
        borderRadius="large"
        background="blue100"
        borderColor="blue200"
        borderWidth="standard"
      >
        <Box display="flex" alignItems="flexStart">
          <Box
            display="flex"
            alignItems="center"
            marginRight={2}
            flexShrink={0}
          >
            <Icon type="filled" color="blue400" icon="informationCircle" />
          </Box>
          <Text variant="small">
            {formatMessage(contactInfo.counterParty.info)}
          </Text>
        </Box>
      </Box>
    </>
  )
}

export default ContactInfo
