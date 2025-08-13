import * as kennitala from 'kennitala'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import { IDENTITY_QUERY } from '../../graphql/queries'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Box,
  GridColumn,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import {
  DatePickerController,
  InputController,
  RadioController,
} from '@island.is/shared/form-fields'
import { FieldBaseProps, GenericFormField } from '@island.is/application/types'
import { information, personal, selectChildren } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { HiddenTextInput } from '../HiddenTextInput'
import debounce from 'lodash/debounce'
import { ChildrenOfApplicant } from '../../shared'
import { getSelectedCustodyChild } from '../../utils'
import { getErrorViaPath, NO, YES } from '@island.is/application/core'

interface Props {
  index: number
  readOnlyFields: boolean
  repeaterField: GenericFormField<ChildrenOfApplicant>
}

export const SelectedRepeaterItem: FC<Props & FieldBaseProps> = ({
  index,
  readOnlyFields,
  repeaterField,
  ...props
}) => {
  const { application, field, errors } = props
  const { setValue } = useFormContext()
  const { formatMessage, lang } = useLocale()

  const [showMoreQuestions, setShowMoreQuestions] = useState<boolean>(
    repeaterField.hasFullCustody === NO ? true : false,
  )
  const [nationalIdInput, setNationalIdInput] = useState(
    repeaterField.otherParentNationalId
      ? repeaterField.otherParentNationalId
      : '',
  )
  const [currentName, setCurrentName] = useState(
    repeaterField.otherParentName ? repeaterField.otherParentName : '',
  )
  const [currentBirthDate, setCurrentBirthDate] = useState(
    repeaterField.otherParentBirtDate ? repeaterField.otherParentBirtDate : '',
  )

  const currentNameField = `selectedChildrenExtraData[${index}].otherParentName`
  const wasRemovedField = `selectedChildrenExtraData[${index}].wasRemoved`
  const otherParentNationalIdField = `selectedChildrenExtraData[${index}].otherParentNationalId`
  const otherParentNameField = `selectedChildrenExtraData[${index}].otherParentName`
  const otherParentBirthDateField = `selectedChildrenExtraData[${index}].otherParentBirtDate`

  const [getIdentity, { loading: queryLoading }] = useLazyQuery<
    Query,
    { input: IdentityInput }
  >(
    gql`
      ${IDENTITY_QUERY}
    `,
    {
      onCompleted: (data) => {
        const currentName = data.identity?.name ?? ''
        setCurrentName(currentName)
        setValue(currentNameField, currentName)
      },
    },
  )

  useEffect(() => {
    if (nationalIdInput.length === 10 && kennitala.isValid(nationalIdInput)) {
      getIdentity({
        variables: {
          input: {
            nationalId: nationalIdInput,
          },
        },
      })
    }
  }, [nationalIdInput, getIdentity])

  const child = getSelectedCustodyChild(
    application.externalData,
    application.answers,
    index,
    repeaterField.nationalId || '',
  )

  useEffect(() => {
    if (repeaterField.otherParentNationalId) {
      setNationalIdInput(repeaterField.otherParentNationalId)
      setValue(otherParentNationalIdField, repeaterField.otherParentNationalId)
    }
  }, [repeaterField.otherParentNationalId])

  const nameError =
    errors &&
    getErrorViaPath(errors, otherParentNameField) &&
    getErrorViaPath(errors, otherParentNameField).length > 0
      ? getErrorViaPath(errors, otherParentNameField)
      : ''

  useEffect(() => {
    if (!showMoreQuestions) {
      setValue(wasRemovedField, 'true')
    } else {
      setValue(wasRemovedField, 'false')
    }
  }, [showMoreQuestions, wasRemovedField, setValue])

  return (
    <Box key={`child-${index}`}>
      <Text variant="h4" as="h3" paddingBottom={1}>
        {formatMessage(selectChildren.extraInformation.areaSeparator, {
          fullName: child?.fullName,
        })}
      </Text>
      <Text paddingBottom={1}>
        {formatMessage(selectChildren.extraInformation.fullCustodyQuestion)}
      </Text>
      <RadioController
        id={`selectedChildrenExtraData[${index}].hasFullCustody`}
        split="1/2"
        onSelect={(value) => {
          setShowMoreQuestions(value === YES ? false : true)
        }}
        disabled={readOnlyFields}
        defaultValue={repeaterField.hasFullCustody === NO ? NO : ''}
        options={[
          {
            value: YES,
            label: formatMessage(
              information.labels.radioButtons.radioOptionYes,
            ),
          },
          {
            value: NO,
            label: formatMessage(information.labels.radioButtons.radioOptionNo),
          },
        ]}
      />

      <HiddenTextInput
        application={application}
        field={{
          ...field,
          id: `selectedChildrenExtraData[${index}].nationalId`,
          props: {
            nationalId: repeaterField.nationalId || '',
          },
        }}
      />

      {showMoreQuestions && (
        <Box>
          <Text>
            {formatMessage(selectChildren.extraInformation.detailsDescription)}
          </Text>
          <GridRow>
            <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
              <InputController
                id={otherParentNationalIdField}
                label={formatMessage(
                  personal.labels.userInformation.nationalId,
                )}
                format="######-####"
                required={false}
                readOnly={readOnlyFields}
                onChange={debounce((v) => {
                  setNationalIdInput(v.target.value.replace(/\W/g, ''))
                })}
                error={
                  errors && getErrorViaPath(errors, otherParentNationalIdField)
                }
                loading={queryLoading}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
              <Input
                name={otherParentNameField}
                value={currentName}
                readOnly={readOnlyFields}
                label={formatMessage(personal.labels.userInformation.name)}
                hasError={!!nameError}
                errorMessage={nameError}
                onChange={(e) => {
                  setCurrentName(e.target.value)
                  setValue(currentNameField, e.target.value)
                }}
              />
            </GridColumn>
          </GridRow>
          {!readOnlyFields && (
            <GridRow>
              <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                <DatePickerController
                  defaultValue={currentBirthDate}
                  id={otherParentBirthDateField}
                  locale={lang}
                  label={formatMessage(
                    selectChildren.extraInformation.dateLabel,
                  )}
                  onChange={(value) => setCurrentBirthDate(value as string)}
                  error={
                    errors && getErrorViaPath(errors, otherParentBirthDateField)
                  }
                  maxDate={new Date()}
                />
              </GridColumn>
            </GridRow>
          )}
        </Box>
      )}
    </Box>
  )
}
