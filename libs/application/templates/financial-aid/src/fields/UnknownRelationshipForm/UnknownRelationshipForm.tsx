import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { ApproveOptions, ErrorSchema, FAFieldBaseProps } from '../../lib/types'
import { MessageDescriptor, useIntl } from 'react-intl'
import { unknownRelationship, error } from '../../lib/messages'
import DescriptionText from '../DescriptionText/DescriptionText'
import { useFormContext } from 'react-hook-form'
import {
  RadioController,
  InputController,
  CheckboxController,
} from '@island.is/shared/form-fields'

import * as styles from '../Shared.css'
import cn from 'classnames'
import { isValidEmail, isValidNationalId } from '../../lib/utils'

const emailValidationCheck = (errors: ErrorSchema, values: string) => {
  const { formatMessage } = useIntl()
  if (errors.relationshipStatus !== undefined && !isValidEmail(values)) {
    return formatMessage(error.validation.email)
  }
  return undefined
}

const nationalIdValidationCheck = (errors: ErrorSchema, values: string) => {
  const { formatMessage } = useIntl()
  if (errors.relationshipStatus !== undefined && !isValidNationalId(values)) {
    return formatMessage(error.validation.nationalId)
  }
  return undefined
}

const approveValidationCheck = (errors: ErrorSchema, values: string) => {
  const { formatMessage } = useIntl()
  if (errors.relationshipStatus !== undefined && values?.length !== 1) {
    return formatMessage(error.validation.approveSpouse)
  }
  return undefined
}

export type validationType = 'email' | 'nationalId' | 'approveItems'

const validationCheck = (errors: ErrorSchema, type: validationType) => {
  const { formatMessage } = useIntl()
  const { getValues } = useFormContext()
  const errorIdForSpouse = 'relationshipStatus'

  switch (type) {
    case 'email':
      return {
        validation: !isValidEmail(getValues(`${errorIdForSpouse}.spouseEmail`)),
        message: error.validation.email,
      }
    case 'nationalId':
      return {
        validation: !isValidNationalId(
          getValues(`${errorIdForSpouse}.spouseNationalId`),
        ),
        message: error.validation.nationalId,
      }
    case 'approveItems':
      return {
        validation:
          getValues(`${errorIdForSpouse}.spouseNationalId`)?.length !== 1,
        message: error.validation.nationalId,
      }
  }

  // if (errors.relationshipStatus !== undefined && validation) {
  //   return formatMessage(message)
  // }
  // return undefined
}

const UnknownRelationshipForm = ({ errors, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application
  const { clearErrors, getValues } = useFormContext()

  const typeInput = {
    id: 'relationshipStatus.unregisteredCohabitation',
    error: errors?.relationshipStatus?.unregisteredCohabitation,
  }
  const errorIdForSpouse = 'relationshipStatus'

  const spouseEmail = {
    id: 'relationshipStatus.spouseEmail',
    // error: emailValidationCheck(
    //   errors,
    //   getValues('relationshipStatus.spouseEmail'),
    // ),

    error: validationCheck(errors, 'email'),
  }
  const spouseNationalId = {
    id: 'relationshipStatus.spouseNationalId',
    error: nationalIdValidationCheck(
      errors,
      getValues('relationshipStatus.spouseNationalId'),
    ),
  }

  const spouseApproveTerms = {
    id: 'relationshipStatus.spouseApproveTerms',
    error: approveValidationCheck(
      errors,
      getValues('relationshipStatus.spouseApproveTerms'),
    ),
  }

  return (
    <>
      <Text variant="intro" marginBottom={[2, 2, 3]} marginTop={2}>
        {formatMessage(unknownRelationship.general.intro)}
      </Text>
      <Box marginBottom={[3, 3, 4]}>
        <DescriptionText text={unknownRelationship.general.description} />
      </Box>
      <Text as="h3" variant="h3" marginBottom={[3, 3, 4]}>
        {formatMessage(unknownRelationship.form.title)}
      </Text>
      <Box marginBottom={1}>
        <RadioController
          id={typeInput.id}
          defaultValue={answers?.relationshipStatus?.unregisteredCohabitation}
          options={[
            {
              value: ApproveOptions.No,
              label: formatMessage(unknownRelationship.form.radioButtonNo),
            },
            {
              value: ApproveOptions.Yes,
              label: formatMessage(unknownRelationship.form.radioButtonYes),
            },
          ]}
          largeButtons
          backgroundColor="white"
          error={typeInput.error}
        />
      </Box>

      <Box
        className={cn({
          [`${styles.inputContainer}`]: true,
          [`${styles.formAppear}`]:
            getValues(typeInput.id) === ApproveOptions.Yes,
        })}
      >
        <Box marginBottom={[2, 2, 3]}>
          <InputController
            id={spouseNationalId.id}
            name={spouseNationalId.id}
            backgroundColor="blue"
            placeholder={formatMessage(
              unknownRelationship.inputs.spouseNationalIdPlaceholder,
            )}
            label={formatMessage(unknownRelationship.inputs.spouseNationalId)}
            error={spouseNationalId.error}
            defaultValue={getValues(spouseNationalId.id)}
            onChange={() => {
              clearErrors(errorIdForSpouse)
            }}
          />
        </Box>
        <Box marginBottom={[2, 2, 3]}>
          <InputController
            id={spouseEmail.id}
            name={spouseEmail.id}
            backgroundColor="blue"
            type="email"
            placeholder={formatMessage(
              unknownRelationship.inputs.spouseEmailPlaceholder,
            )}
            label={formatMessage(unknownRelationship.inputs.spouseEmail)}
            error={spouseEmail.error}
            defaultValue={getValues(spouseEmail.id)}
            onChange={() => {
              clearErrors(errorIdForSpouse)
            }}
          />
        </Box>
        <CheckboxController
          id={spouseApproveTerms.id}
          name={spouseApproveTerms.id}
          backgroundColor="blue"
          large={true}
          defaultValue={getValues(spouseApproveTerms.id)}
          error={spouseApproveTerms.error}
          options={[
            {
              value: 'yes',
              label: formatMessage(unknownRelationship.inputs.checkboxLabel),
            },
          ]}
        />
      </Box>
    </>
  )
}

export default UnknownRelationshipForm
function getValues(arg0: string): string {
  throw new Error('Function not implemented.')
}
