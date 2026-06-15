import { FC } from 'react'
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
  type Employee,
} from '../../lib/constants'
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
  additionalSalary: string
  bonusSalary: string
}

const DEFAULTS: FormValues = {
  roleTitle: '',
  gender: '',
  education: '',
  field: '',
  department: '',
  startDate: '',
  workRatio: '100',
  baseSalary: '',
  additionalSalary: '',
  bonusSalary: '',
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

  const onValid = (data: FormValues) => {
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
      additionalSalary: Number(data.additionalSalary) || 0,
      bonusSalary: data.bonusSalary === '' ? 0 : Number(data.bonusSalary) || 0,
      personalStepAssignments: [],
    })
  }

  return (
    <FormProvider {...methods}>
      <Box
        background="blue100"
        borderRadius="large"
        padding={4}
        marginTop={3}
      >
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
          <GridColumn span={['12/12', '6/12']}>
            <InputController
              id="additionalSalary"
              name="additionalSalary"
              label={formatMessage(m.additionalSalaryLabel)}
              type="number"
              backgroundColor="white"
              size="sm"
            />
          </GridColumn>
          <GridColumn span={['12/12', '6/12']}>
            <InputController
              id="bonusSalary"
              name="bonusSalary"
              label={formatMessage(m.bonusSalaryLabel)}
              type="number"
              backgroundColor="white"
              size="sm"
            />
          </GridColumn>
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
