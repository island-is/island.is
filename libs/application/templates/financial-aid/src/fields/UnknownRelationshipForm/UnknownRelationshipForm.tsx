import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { ApproveOptions, FAFieldBaseProps } from '../../lib/types'
import { useIntl } from 'react-intl'
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

const UnknownRelationshipForm = ({ errors, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application
  const { clearErrors, getValues } = useFormContext()

  const typeInput = {
    id: 'relationshipStatus.unregisteredCohabitation',
    error: errors?.relationshipStatus?.unregisteredCohabitation,
  }

  const spouseEmail = {
    id: 'relationshipStatus.spouseEmail',
    error:
      errors.relationshipStatus !== undefined &&
      !isValidEmail(getValues('relationshipStatus.spouseEmail'))
        ? formatMessage(error.validation.email)
        : undefined,
  }
  const spouseNationlId = {
    id: 'relationshipStatus.spouseNationalId',
    error:
      errors.relationshipStatus !== undefined &&
      !isValidNationalId(getValues('relationshipStatus.spouseNationalId'))
        ? formatMessage(error.validation.nationlId)
        : undefined,
  }
  const spouseApproveTerms = {
    id: 'relationshipStatus.spouseApproveTerms',
    error:
      errors.relationshipStatus !== undefined &&
      getValues('relationshipStatus.spouseApproveTerms')?.length !== 1
        ? formatMessage(error.validation.approveSpouse)
        : undefined,
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
            id={spouseNationlId.id}
            name={spouseNationlId.id}
            backgroundColor="blue"
            placeholder={formatMessage(
              unknownRelationship.inputs.spouseNationlIdPlaceholder,
            )}
            label={formatMessage(unknownRelationship.inputs.spouseNationlId)}
            error={spouseNationlId.error}
            defaultValue={getValues(spouseNationlId.id)}
            onChange={() => {
              clearErrors(spouseNationlId.id)
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
              clearErrors(spouseEmail.id)
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
