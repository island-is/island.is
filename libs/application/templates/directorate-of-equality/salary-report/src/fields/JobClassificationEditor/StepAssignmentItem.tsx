import { FC } from 'react'
import { useWatch } from 'react-hook-form'
import { Box, Text } from '@island.is/island-ui/core'
import { SelectController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import type { StepMeta } from './utils'

type Props = {
  fieldName: string
  subTitle: string
  defaultStepOrder: number
  meta?: StepMeta
}

export const StepAssignmentItem: FC<Props> = ({
  fieldName,
  subTitle,
  defaultStepOrder,
  meta,
}) => {
  const { formatMessage } = useLocale()
  const m = messages.report.jobClassification

  const options = (meta?.steps ?? []).map((s) => ({
    value: s.order,
    label: `${s.order}/${meta?.totalSteps ?? s.order}`,
  }))

  const info = meta
    ? formatMessage(m.subCriterionInfo, {
        description: meta.description,
        weight: meta.weight,
        max: meta.maxScore,
      })
    : ''

  // Live-updates as the select changes, same lookup computeRoleScore uses —
  // just scoped to this one sub-criterion instead of summed across a role.
  const watchedStepOrder = useWatch({
    name: fieldName,
    defaultValue: defaultStepOrder,
  }) as number | string | undefined
  const stepOrder = Number(watchedStepOrder ?? defaultStepOrder)
  const step = meta?.steps.find((s) => s.order === stepOrder)
  const score = Math.round(step?.score ?? 0)
  const max = Math.round(meta?.maxScore ?? 0)

  return (
    <Box
      background="blue100"
      borderRadius="large"
      padding={3}
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      columnGap={3}
    >
      <Box>
        <Text color="blue400" fontWeight="semiBold">
          {subTitle}
        </Text>
        {info && <Text variant="small">{info}</Text>}
      </Box>
      <Box style={{ minWidth: 140 }}>
        <SelectController
          id={fieldName}
          name={fieldName}
          label={formatMessage(m.stigLabel)}
          options={options}
          defaultValue={defaultStepOrder}
          backgroundColor="white"
          size="sm"
        />
        {meta && (
          <Text variant="small" color="dark400" textAlign="right" marginTop={1}>
            {formatMessage(m.roleScore, { score, max })}
          </Text>
        )}
      </Box>
    </Box>
  )
}
