import React from 'react'
import { useIntl } from 'react-intl'
import { useFormContext } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { contactInfo } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { DescriptionText, InfoBanner } from '../components'

const emailId = 'parentB.email'
const phoneNumberId = 'parentB.phoneNumber'

export const contactInfoParentBIds = [emailId, phoneNumberId]

const ContactInfoParentB = ({ errors, application }: CRCFieldBaseProps) => {
  const { answers } = application
  const { formatMessage } = useIntl()
  const { clearErrors } = useFormContext()
  const emailError = errors?.parentB?.email
  const phoneNumberError = errors?.parentB?.phoneNumber

  return (
    <>
      <Box marginTop={3}>
        <DescriptionText text={contactInfo.general.description} />
      </Box>
      <GridContainer>
        <GridRow marginTop={5}>
          <GridColumn
            span={['1/1', '1/2', '1/1', '2/3']}
            paddingBottom={[2, 0, 2, 0]}
          >
            <InputController
              id={emailId}
              name={emailId}
              backgroundColor="blue"
              type="email"
              label={formatMessage(contactInfo.inputs.emailLabel)}
              error={emailError}
              defaultValue={answers?.parentB?.email || ''}
              onChange={() => {
                clearErrors(emailId)
              }}
            />
          </GridColumn>
          <GridColumn span={['1/1', '1/2', '1/1', '1/3']}>
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
              defaultValue={answers?.parentB?.phoneNumber || ''}
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </>
  )
}

export default ContactInfoParentB
