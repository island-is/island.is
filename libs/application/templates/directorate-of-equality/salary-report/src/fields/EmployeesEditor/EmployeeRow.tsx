import { FC, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import {
  Box,
  Button,
  DialogPrompt,
  GridColumn,
  GridRow,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { GENDER_LABELS, SALARY_COMPONENT_KEYS } from '../../utils/constants'
import type { Employee } from '../../utils/types'
import {
  formatCurrency,
  formatStartDate,
  formatPaidHours,
  getSalaryComponentLabels,
} from './utils'
import * as styles from './EmployeesEditor.css'

type Props = {
  employee: Employee
  identifier: string
  roleTitleById: Record<string, string>
  onRemove: () => void
  onEdit: () => void
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

export const EmployeeRow: FC<Props> = ({
  employee,
  identifier,
  roleTitleById,
  onRemove,
  onEdit,
}) => {
  const { formatMessage } = useLocale()
  const [expanded, setExpanded] = useState(false)
  const m = messages.report.employees

  const background = expanded ? 'blue100' : 'transparent'

  const leftItems = [
    { label: formatMessage(m.identifierLabel), value: identifier },
    { label: formatMessage(m.fieldLabel), value: employee.field ?? '' },
    {
      label: formatMessage(m.departmentLabel),
      value: employee.department ?? '',
    },
    {
      label: formatMessage(m.startDateLabel),
      value: formatStartDate(employee.startDate),
    },
  ]

  const componentLabels = getSalaryComponentLabels(formatMessage)

  const rightItems = [
    {
      label: formatMessage(m.paidHoursLabel),
      value: formatPaidHours(employee.paidHours),
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
        <T.Data box={{ background }}>{identifier}</T.Data>
        <T.Data box={{ background }}>
          {roleTitleById[employee.roleId] ?? ''}
        </T.Data>
        <T.Data box={{ background }}>
          {GENDER_LABELS[employee.gender] ?? employee.gender}
        </T.Data>
        <T.Data box={{ background, textAlign: 'right' }}>
          <Box display="flex" justifyContent="flexEnd">
            <Button
              circle
              colorScheme="light"
              icon="pencil"
              iconType="outline"
              onClick={onEdit}
              size="small"
              type="button"
              variant="ghost"
              title={formatMessage(m.editButton)}
            />
            <Box marginLeft={1}>
              <DialogPrompt
                baseId={`employee_remove_dialog_${identifier}`}
                title={formatMessage(m.removeConfirmTitle)}
                description={formatMessage(m.removeConfirmDescription)}
                ariaLabel={formatMessage(m.removeButton)}
                disclosureElement={
                  <Button
                    circle
                    colorScheme="light"
                    icon="trash"
                    iconType="outline"
                    size="small"
                    type="button"
                    variant="ghost"
                    title={formatMessage(m.removeButton)}
                  />
                }
                onConfirm={onRemove}
                buttonTextConfirm={formatMessage(m.removeConfirmButton)}
                buttonTextCancel={formatMessage(m.cancelButton)}
                buttonPropsConfirm={{ colorScheme: 'destructive' }}
              />
            </Box>
          </Box>
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
