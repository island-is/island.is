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
import {
  FieldBaseProps,
  GenericFormField,
  NO,
  YES,
} from '@island.is/application/types'
import { information, personal, selectChildren } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { HiddenTextInput } from '../HiddenTextInput'
import { debounce } from 'lodash'
import { ChildrenOfApplicant } from '../../shared'
import { getSelectedCustodyChild } from '../../utils'

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
  const { application, errors, field } = props
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()

  const [showMoreQuestions, setShowMoreQuestions] = useState<boolean>(
    repeaterField.hasFullCustody === 'no' ? true : false,
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

  const [getIdentity, { data, loading: queryLoading, error: queryError }] =
    useLazyQuery<Query, { input: IdentityInput }>(
      gql`
        ${IDENTITY_QUERY}
      `,
      {
        onCompleted: (data) => {
          const currentName = `${data.identity?.givenName} ${data.identity?.familyName}`
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
  )

  return (
    <Box>
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
          setShowMoreQuestions(!showMoreQuestions)
        }}
        defaultValue={repeaterField.hasFullCustody === 'yes' ? YES : NO}
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
            index: index,
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
                id={`selectedChildrenExtraData[${index}].otherParentNationalId`}
                label={formatMessage(
                  personal.labels.userInformation.nationalId,
                )}
                format="######-####"
                required={false}
                readOnly={readOnlyFields}
                onChange={debounce((v) => {
                  setNationalIdInput(v.target.value.replace(/\W/g, ''))
                  // setValue(
                  //   `selectedChildrenExtraData[${index}].otherParentNationalId`,
                  //   v.target.value.replace(/\W/g, ''),
                  // )
                })}
                loading={queryLoading}
                // error={errors && getErrorViaPath(errors, nationaIdField)}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
              <Input
                name={`selectedChildrenExtraData[${index}].otherParentName`}
                value={currentName}
                readOnly={readOnlyFields}
                label={formatMessage(personal.labels.userInformation.name)}
                onChange={(e) => {
                  setCurrentName(e.target.value)
                  setValue(currentNameField, e.target.value)
                }}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
              <DatePickerController
                defaultValue={currentBirthDate}
                id={`selectedChildrenExtraData[${index}].otherParentBirtDate`}
                label={formatMessage(selectChildren.extraInformation.dateLabel)}
                // error={errors && getErrorViaPath(errors, dateFromField)}
                onChange={(value) => setCurrentBirthDate(value as string)}
              />
            </GridColumn>
          </GridRow>
        </Box>
      )}
    </Box>
  )
}
