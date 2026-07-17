import { FC, Fragment } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import {
  InputController,
  SelectController,
  DatePickerController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { messages } from '../../lib/messages'
import {
  EDUCATION_OPTIONS,
  GENDER_OPTIONS,
  SALARY_COMPONENT_GROUPS,
  SALARY_COMPONENT_KEYS,
} from '../../utils/constants'
import type { Employee, SalaryComponentKey } from '../../utils/types'
import { computeIdentifier } from './utils'

type Props = {
  nextOrdinal: number
  identifierPrefix: string
  onAdd: (employee: Employee) => void
  onCancel: () => void
}

type FormValues = {
  roleTitle: string
  gender: string
  education: string
  field: string
  department: string
  startDate: string
  workRatio: string
  baseSalary: string
} & Record<SalaryComponentKey, string>

const DEFAULTS: FormValues = {
  roleTitle: '',
  gender: '',
  education: '',
  field: '',
  department: '',
  startDate: '',
  workRatio: '100',
  baseSalary: '',
  ...(Object.fromEntries(
    SALARY_COMPONENT_KEYS.map((key) => [key, '']),
  ) as Record<SalaryComponentKey, string>),
}

export const AddEmployeeForm: FC<Props> = ({
  nextOrdinal,
  identifierPrefix,
  onAdd,
  onCancel,
}) => {
  const { formatMessage, lang } = useLocale()
  const m = messages.report.employees
  const methods = useForm<FormValues>({ defaultValues: DEFAULTS })
  const {
    formState: { errors },
  } = methods

  const requiredMsg = formatMessage(messages.errors.required)

  const componentLabels: Record<SalaryComponentKey, string> = {
    additionalFixedOvertime: formatMessage(m.additionalFixedOvertimeLabel),
    additionalFixedCarAllowance: formatMessage(
      m.additionalFixedCarAllowanceLabel,
    ),
    bonusOccasionalCarAllowance: formatMessage(
      m.bonusOccasionalCarAllowanceLabel,
    ),
    bonusOccasionalOvertime: formatMessage(m.bonusOccasionalOvertimeLabel),
    bonusPayments: formatMessage(m.bonusPaymentsLabel),
    bonusOther: formatMessage(m.bonusOtherLabel),
  }

  const groupHeadings: Record<'additional' | 'bonus', string> = {
    additional: formatMessage(m.additionalSalaryLabel),
    bonus: formatMessage(m.bonusSalaryLabel),
  }

  const onValid = (data: FormValues) => {
    // startDate uses the shared DatePickerController, which doesn't accept RHF
    // `rules`, so enforce the requirement here (the `required` prop is UI-only).
    if (!data.startDate) {
      methods.setError('startDate', { type: 'required', message: requiredMsg })
      return
    }

    // Empty component → null (the API treats each component as optional/nullable)
    const components = Object.fromEntries(
      SALARY_COMPONENT_KEYS.map((key) => [
        key,
        data[key] === '' ? null : Number(data[key]) || 0,
      ]),
    ) as Record<SalaryComponentKey, number | null>

    onAdd({
      ordinal: nextOrdinal,
      identifier: computeIdentifier(identifierPrefix, nextOrdinal),
      roleTitle: data.roleTitle,
      gender: data.gender,
      education: data.education,
      field: data.field,
      department: data.department,
      startDate: data.startDate,
      workRatio: (Number(data.workRatio) || 0) / 100,
      baseSalary: Number(data.baseSalary) || 0,
      ...components,
      personalStepAssignments: [],
    })
  }

  return (
    <FormProvider {...methods}>
      <Box background="blue100" borderRadius="large" padding={4} marginTop={3}>
        <Text variant="h4" marginBottom={3}>
          {formatMessage(m.addFormTitle)}
        </Text>
        <GridRow rowGap={[2, 2, 2, 3]}>
          <GridColumn span={['12/12', '6/12']}>
            <InputController
              id="roleTitle"
              name="roleTitle"
              label={formatMessage(m.roleInputLabel)}
              backgroundColor="white"
              size="sm"
              required
              rules={{ required: requiredMsg }}
              error={errors.roleTitle?.message}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <SelectController
              id="gender"
              name="gender"
              label={formatMessage(m.genderInputLabel)}
              options={GENDER_OPTIONS}
              backgroundColor="white"
              size="sm"
              required
              rules={{ required: requiredMsg }}
              error={errors.gender?.message}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <SelectController
              id="education"
              name="education"
              label={formatMessage(m.educationLabel)}
              options={EDUCATION_OPTIONS}
              backgroundColor="white"
              size="sm"
              required
              rules={{ required: requiredMsg }}
              error={errors.education?.message}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <InputController
              id="field"
              name="field"
              label={formatMessage(m.fieldLabel)}
              backgroundColor="white"
              size="sm"
              required
              rules={{ required: requiredMsg }}
              error={errors.field?.message}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <InputController
              id="department"
              name="department"
              label={formatMessage(m.departmentLabel)}
              backgroundColor="white"
              size="sm"
              required
              rules={{ required: requiredMsg }}
              error={errors.department?.message}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <DatePickerController
              id="startDate"
              name="startDate"
              label={formatMessage(m.startDateLabel)}
              locale={lang as Locale}
              backgroundColor="white"
              size="sm"
              required
              error={errors.startDate?.message}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <InputController
              id="workRatio"
              name="workRatio"
              label={formatMessage(m.workRatioInputLabel)}
              type="number"
              suffix="%"
              backgroundColor="white"
              size="sm"
              required
              rules={{ required: requiredMsg }}
              error={errors.workRatio?.message}
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <InputController
              id="baseSalary"
              name="baseSalary"
              label={formatMessage(m.baseSalaryLabel)}
              type="number"
              backgroundColor="white"
              size="sm"
              required
              rules={{ required: requiredMsg }}
              error={errors.baseSalary?.message}
            />
          </GridColumn>
          {SALARY_COMPONENT_GROUPS.map(({ group, keys }) => (
            <Fragment key={group}>
              <GridColumn span="12/12">
                <Text variant="h5" marginTop={2}>
                  {groupHeadings[group]}
                </Text>
              </GridColumn>
              {keys.map((key) => (
                <GridColumn key={key} span={['12/12', '6/12']}>
                  <InputController
                    id={key}
                    name={key}
                    label={componentLabels[key]}
                    type="number"
                    backgroundColor="white"
                    size="sm"
                  />
                </GridColumn>
              ))}
            </Fragment>
          ))}
        </GridRow>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flexEnd"
          marginTop={3}
        >
          <Button variant="ghost" type="button" onClick={onCancel}>
            {formatMessage(m.cancelButton)}
          </Button>
          <Box marginLeft={2}>
            <Button type="button" onClick={methods.handleSubmit(onValid)}>
              {formatMessage(m.saveButton)}
            </Button>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  )
}
