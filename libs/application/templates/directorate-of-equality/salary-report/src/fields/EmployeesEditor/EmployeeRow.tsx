import { FC, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import {
  EDUCATION_LABELS,
  GENDER_LABELS,
  SALARY_COMPONENT_KEYS,
  type Employee,
  type SalaryComponentKey,
} from '../../lib/constants'
import { formatCurrency, formatStartDate, formatWorkRatio } from './utils'
import * as styles from './EmployeesEditor.css'

type Props = {
  employee: Employee
  onRemove: () => void
}

// Alternating white / transparent (blue container shows through) rows.
const DetailItem: FC<{ label: string; value: string; highlight: boolean }> = ({
  label,
  value,
  highlight,
}) => (
  <Box
    display="flex"
    paddingX={3}
    paddingY={2}
    borderRadius="large"
    background={highlight ? 'white' : 'transparent'}
  >
    <Box style={{ flex: 1 }}>
      <Text variant="medium" fontWeight="semiBold">
        {label}
      </Text>
    </Box>
    <Box style={{ flex: 1 }}>
      <Text variant="medium">{value}</Text>
    </Box>
  </Box>
)

export const EmployeeRow: FC<Props> = ({ employee, onRemove }) => {
  const { formatMessage } = useLocale()
  const [expanded, setExpanded] = useState(false)
  const m = messages.report.employees

  const background = expanded ? 'blue100' : 'transparent'

  const leftItems = [
    { label: formatMessage(m.identifierLabel), value: employee.identifier },
    {
      label: formatMessage(m.educationLabel),
      value: EDUCATION_LABELS[employee.education] ?? employee.education,
    },
    { label: formatMessage(m.fieldLabel), value: employee.field },
    { label: formatMessage(m.departmentLabel), value: employee.department },
    {
      label: formatMessage(m.startDateLabel),
      value: formatStartDate(employee.startDate),
    },
  ]

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

  const rightItems = [
    {
      label: formatMessage(m.workRatioLabel),
      value: formatWorkRatio(employee.workRatio),
    },
    {
      label: formatMessage(m.baseSalaryLabel),
      value: formatCurrency(employee.baseSalary),
    },
    ...SALARY_COMPONENT_KEYS.map((key) => ({
      label: componentLabels[key],
      value: formatCurrency(employee[key]),
    })),
  ]

  return (
    <>
      <T.Row>
        <T.Data box={{ background, position: 'relative' }}>
          {expanded && <div className={styles.line} />}
          <Button
            circle
            colorScheme="light"
            icon={expanded ? 'remove' : 'add'}
            iconType="filled"
            onClick={() => setExpanded((v) => !v)}
            size="small"
            type="button"
            variant="primary"
            title={formatMessage(m.nameColumn)}
          />
        </T.Data>
        <T.Data box={{ background }}>{employee.identifier}</T.Data>
        <T.Data box={{ background }}>{employee.roleTitle}</T.Data>
        <T.Data box={{ background }}>
          {GENDER_LABELS[employee.gender] ?? employee.gender}
        </T.Data>
        <T.Data box={{ background, textAlign: 'right' }}>
          <Button
            circle
            colorScheme="light"
            icon="trash"
            iconType="outline"
            onClick={onRemove}
            size="small"
            type="button"
            variant="ghost"
            title={formatMessage(m.removeButton)}
          />
        </T.Data>
      </T.Row>
      <T.Row>
        <T.Data
          style={{ padding: 0 }}
          box={{ background, position: 'relative' }}
          colSpan={5}
        >
          <AnimateHeight duration={300} height={expanded ? 'auto' : 0}>
            {expanded && <div className={styles.line} />}
            <Box paddingX={3} paddingTop={3} paddingBottom={3}>
              <GridRow>
                <GridColumn span={['12/12', '12/12', '6/12']}>
                  <Stack space={0} dividers={false}>
                    {leftItems.map((item, i) => (
                      <DetailItem
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        highlight={i % 2 === 0}
                      />
                    ))}
                  </Stack>
                </GridColumn>
                <GridColumn span={['12/12', '12/12', '6/12']}>
                  <Stack space={0} dividers={false}>
                    {rightItems.map((item, i) => (
                      <DetailItem
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        highlight={i % 2 === 0}
                      />
                    ))}
                  </Stack>
                </GridColumn>
              </GridRow>
            </Box>
          </AnimateHeight>
        </T.Data>
      </T.Row>
    </>
  )
}
