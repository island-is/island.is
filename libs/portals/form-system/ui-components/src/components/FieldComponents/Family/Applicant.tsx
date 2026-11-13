import { FormSystemField } from '@island.is/api/schema'
import {
  ApplicantTypesEnum,
  FieldTypesEnum,
} from '@island.is/form-system/enums'
import {
  GridColumn as Column,
  GridRow as Row,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Action, ApplicationState } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  state?: ApplicationState
  item: FormSystemField
  valueIndex?: number
  dispatch?: Dispatch<Action>
  isPreview?: boolean
}

export const Applicant = ({
  state,
  item,
  valueIndex = 0,
  dispatch,
  isPreview = false,
}: Props) => {
  const { lang } = useLocale()
  const { formatMessage } = useIntl()
  const { control, setValue } = useFormContext()
  const applicantTypes = [
    ApplicantTypesEnum.INDIVIDUAL,
    ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION,
    ApplicantTypesEnum.LEGAL_ENTITY,
    ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER,
    ApplicantTypesEnum.WARD_OF_LEGAL_GUARDIAN,
  ]
  const applicant = state?.sections
    ?.flatMap((section) => section.screens ?? [])
    .flatMap((screen) => screen?.fields ?? [])
    .find(
      (field) =>
        field?.fieldType === FieldTypesEnum.APPLICANT &&
        applicantTypes.includes(field.fieldSettings?.applicantType ?? ''),
    )
  const storedNationalId = getValue(item, 'nationalId', valueIndex) ?? ''
  const storedName = getValue(item, 'name', valueIndex) ?? ''
  const useApplicant = !isPreview && applicant != null
  const nationalId = useApplicant
    ? getValue(applicant, 'nationalId') ?? ''
    : storedNationalId
  const name = useApplicant ? getValue(applicant, 'name') ?? '' : storedName
  const nationalIdField = `${item.id}.${valueIndex}`
  const nameField = `${item.id}.${valueIndex}_name`

  useEffect(() => {
    if (!useApplicant) return

    setValue(nationalIdField, nationalId, { shouldValidate: true })
    setValue(nameField, name, { shouldValidate: true })
    if (storedNationalId !== nationalId) {
      dispatch?.({
        type: 'SET_NATIONAL_ID',
        payload: { id: item.id, value: nationalId, valueIndex },
      })
    }
    if (storedName !== name) {
      dispatch?.({
        type: 'SET_NAME',
        payload: { id: item.id, value: name, valueIndex },
      })
    }
  }, [
    dispatch,
    item.id,
    name,
    nameField,
    nationalId,
    nationalIdField,
    setValue,
    storedName,
    storedNationalId,
    useApplicant,
    valueIndex,
  ])

  return (
    <Stack space={2}>
      <Row>
        <Column span="10/10">
          <Controller
            name={nameField}
            control={control}
            defaultValue={name}
            rules={{
              required: {
                value: item.isRequired ?? false,
                message: formatMessage(m.required),
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                label={item.name?.[lang] ?? formatMessage(m.namePerson)}
                name={field.name}
                backgroundColor="blue"
                value={field.value}
                required={item.isRequired ?? false}
                errorMessage={fieldState.error?.message}
                readOnly
              />
            )}
          />
        </Column>
      </Row>
      <Row>
        <Column span={['1/1', '1/1', '5/10']}>
          <Controller
            name={nationalIdField}
            control={control}
            defaultValue={nationalId}
            rules={{
              required: {
                value: item.isRequired ?? false,
                message: formatMessage(m.required),
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                label={formatMessage(m.nationalId)}
                name={field.name}
                backgroundColor="blue"
                value={field.value}
                required={item.isRequired ?? false}
                errorMessage={fieldState.error?.message}
                readOnly
              />
            )}
          />
        </Column>
      </Row>
    </Stack>
  )
}
