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
  GENDER_OPTIONS,
  PAID_HOURS_MAX,
  PAID_HOURS_MIN,
  SALARY_COMPONENT_GROUPS,
} from '../../utils/constants'
import type { Employee } from '../../utils/types'
import {
  EMPTY_EMPLOYEE_FORM_VALUES,
  type EmployeeFormValues,
  getSalaryComponentLabels,
  paidHoursFromFormValue,
  toFormValues,
} from './utils'

type Props = {
  // Present when editing an existing employee; omitted when adding a new one.
  employee?: Employee
  roleTitleById: Record<string, string>
  onSubmit: (values: EmployeeFormValues) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export const EmployeeForm: FC<Props> = ({
  employee,
  roleTitleById,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const { formatMessage, lang } = useLocale()
  const m = messages.report.employees
  const methods = useForm<EmployeeFormValues>({
    defaultValues: employee
      ? toFormValues(employee, roleTitleById)
      : EMPTY_EMPLOYEE_FORM_VALUES,
  })
  const {
    formState: { errors },
  } = methods

  const requiredMsg = formatMessage(messages.errors.required)

  const componentLabels = getSalaryComponentLabels(formatMessage)

  const groupHeadings: Record<'additional' | 'bonus', string> = {
    additional: formatMessage(m.additionalSalaryLabel),
    bonus: formatMessage(m.bonusSalaryLabel),
  }

  const onValid = (data: EmployeeFormValues) => {
    // startDate uses the shared DatePickerController, which doesn't accept RHF
    // `rules`, so enforce the requirement here (the `required` prop is UI-only).
    if (!data.startDate) {
      methods.setError('startDate', { type: 'required', message: requiredMsg })
      return
    }
    // Caller resolves roleTitle/id/ordinal and preserves step assignments.
    onSubmit(data)
  }

  return (
    <FormProvider {...methods}>
      <Box background="blue100" borderRadius="large" padding={4} marginTop={3}>
        <Text variant="h4" marginBottom={3}>
          {formatMessage(employee ? m.editFormTitle : m.addFormTitle)}
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
            <InputController
              id="field"
              name="field"
              label={formatMessage(m.fieldLabel)}
              backgroundColor="white"
              size="sm"
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
              id="paidHours"
              name="paidHours"
              label={formatMessage(m.paidHoursInputLabel)}
              placeholder={formatMessage(m.paidHoursPlaceholder)}
              type="number"
              backgroundColor="white"
              size="sm"
              required
              rules={{
                required: requiredMsg,
                // Mirrors the API rule (4–750). The lower bound exists to catch
                // a starfshlutfall carried into this field: 0,8 or 1 would
                // otherwise pass and inflate tímakaup ~173x silently.
                validate: (value: string) => {
                  const hours = paidHoursFromFormValue(value)
                  return (
                    (hours >= PAID_HOURS_MIN && hours <= PAID_HOURS_MAX) ||
                    formatMessage(m.paidHoursRangeError)
                  )
                },
              }}
              error={errors.paidHours?.message}
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
          <Button
            variant="ghost"
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            {formatMessage(m.cancelButton)}
          </Button>
          <Box marginLeft={2}>
            <Button
              type="button"
              disabled={isSubmitting}
              loading={isSubmitting}
              onClick={methods.handleSubmit(onValid)}
            >
              {formatMessage(m.saveButton)}
            </Button>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  )
}
