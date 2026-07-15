import { FC, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import {
  getErrorViaPath,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { Application, RecordObject } from '@island.is/application/types'
import AnimateHeight from 'react-animate-height'
import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import {
  CheckboxController,
  InputController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import type { SalaryAnalysisOutlierDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { GENDER_LABELS } from '../../utils/constants'
import type { Employee } from '../../utils/types'

const FIELD_NAME = 'salaryAnalysis.outlierGroups.0'

const OutlierRow: FC<{
  outlier: SalaryAnalysisOutlierDto
  employee: Employee | undefined
}> = ({ outlier, employee }) => {
  const { formatMessage } = useLocale()
  const [expanded, setExpanded] = useState(false)
  const m = messages.salaryAnalysis.outlierGroup

  const directionLabels: Record<SalaryAnalysisOutlierDto['direction'], string> =
    {
      ABOVE: formatMessage(m.directionAbove),
      BELOW: formatMessage(m.directionBelow),
      EQUAL: formatMessage(m.directionEqual),
    }
  const directionLabel = directionLabels[outlier.direction]

  const background = expanded ? 'blue100' : 'transparent'

  return (
    <>
      <T.Row>
        <T.Data box={{ background, position: 'relative' }}>
          <Button
            circle
            colorScheme="light"
            icon={expanded ? 'remove' : 'add'}
            iconType="filled"
            onClick={() => setExpanded((v) => !v)}
            size="small"
            type="button"
            variant="primary"
          />
        </T.Data>
        <T.Data box={{ background }}>
          {employee?.identifier ?? outlier.employeeOrdinal}
        </T.Data>
        <T.Data box={{ background }}>{employee?.roleTitle ?? ''}</T.Data>
        <T.Data box={{ background }}>
          {employee ? GENDER_LABELS[employee.gender] ?? employee.gender : ''}
        </T.Data>
        <T.Data box={{ background }}>
          {Math.round(Math.abs(outlier.differencePercent))}%
        </T.Data>
      </T.Row>
      <T.Row>
        <T.Data style={{ padding: 0 }} box={{ background }} colSpan={5}>
          <AnimateHeight duration={300} height={expanded ? 'auto' : 0}>
            <Box paddingX={3} paddingY={3}>
              <Text variant="medium">{directionLabel}</Text>
            </Box>
          </AnimateHeight>
        </T.Data>
      </T.Row>
    </>
  )
}

type Props = {
  application: Application
  outliers: SalaryAnalysisOutlierDto[]
  // True on the POSTPONED-state review screen: the applicant already chose
  // to postpone earlier and can't un-postpone here, so the checkbox is
  // pointless — the form is dedicated to filling in the plan, and the
  // "postponed" answer is force-cleared so it stops being reported to the
  // backend as still postponed once this plan is submitted.
  hidePostponeCheckbox?: boolean
  errors?: RecordObject
}

// Rendered inline by SalaryAnalysisResults, sharing its already-fetched
// analysis result — this must NOT independently re-read
// application.externalData, since a sibling custom field reading that prop
// can be stale relative to the mutation response the parent just received.
export const OutlierGroupPanel: FC<Props> = ({
  application,
  outliers,
  hidePostponeCheckbox,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { setValue, getValues } = useFormContext()
  const m = messages.salaryAnalysis.outlierGroup
  const improvementPlanMessages = messages.salaryAnalysis.improvementPlan

  const fieldError = (suffix: string) =>
    errors ? getErrorViaPath(errors, `${FIELD_NAME}.${suffix}`) : undefined
  const reasonError = fieldError('reason')
  const actionError = fieldError('action')
  const signatureNameError = fieldError('signatureName')
  const signatureRoleError = fieldError('signatureRole')
  const hasMissingFieldError = Boolean(
    reasonError || actionError || signatureNameError || signatureRoleError,
  )

  const employees = (getValueViaPath<Employee[]>(
    application.answers,
    'employees',
    [],
  ) ?? []) as Employee[]
  const employeeByOrdinal = new Map(employees.map((e) => [e.ordinal, e]))

  const postponed: string[] =
    useWatch({ name: 'salaryAnalysis.postponed' }) ?? []
  const isPostponed = postponed.includes(YES)

  useEffect(() => {
    if (hidePostponeCheckbox && postponed.length > 0) {
      setValue('salaryAnalysis.postponed', [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidePostponeCheckbox])

  // The employee ordinals aren't user-editable — they're derived from the
  // detected outlier set and must cover every one of them for the DTO's
  // single-group submission to validate server-side. Nothing to seed when
  // there are no outliers at all.
  useEffect(() => {
    if (outliers.length === 0) return
    const ordinals = outliers.map((o) => o.employeeOrdinal)
    const current = getValues(`${FIELD_NAME}.employeeOrdinals`) as
      | number[]
      | undefined
    if (current?.length !== ordinals.length) {
      setValue(`${FIELD_NAME}.employeeOrdinals`, ordinals)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outliers.length])

  if (outliers.length === 0) return null

  return (
    <Box marginTop={5}>
      <Text variant="h3" marginBottom={1}>
        {formatMessage(improvementPlanMessages.title)}
      </Text>
      <Text marginBottom={3}>
        {formatMessage(improvementPlanMessages.intro)}
      </Text>

      {!hidePostponeCheckbox && (
        <Box
          background="blue100"
          borderRadius="large"
          padding={4}
          marginBottom={4}
        >
          <Text variant="h4" marginBottom={1}>
            {formatMessage(m.postponeCardTitle)}
          </Text>
          <Text marginBottom={2}>
            {formatMessage(m.postponeCardDescription)}
          </Text>
          <CheckboxController
            id="salaryAnalysis.postponed"
            name="salaryAnalysis.postponed"
            options={[
              { label: formatMessage(m.postponeCheckboxLabel), value: YES },
            ]}
          />
        </Box>
      )}

      <Box marginBottom={4}>
        <Text variant="h4" marginBottom={2}>
          {formatMessage(m.listTitle)}
        </Text>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData></T.HeadData>
              <T.HeadData>{formatMessage(m.employeeColumn)}</T.HeadData>
              <T.HeadData>{formatMessage(m.roleColumn)}</T.HeadData>
              <T.HeadData>{formatMessage(m.genderColumn)}</T.HeadData>
              <T.HeadData>{formatMessage(m.differenceColumn)}</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {outliers.map((outlier) => (
              <OutlierRow
                key={outlier.employeeOrdinal}
                outlier={outlier}
                employee={employeeByOrdinal.get(outlier.employeeOrdinal)}
              />
            ))}
          </T.Body>
        </T.Table>
      </Box>

      {hasMissingFieldError && (
        <Box marginBottom={3}>
          <AlertMessage
            type="error"
            message={formatMessage(
              hidePostponeCheckbox
                ? m.formErrorRequired
                : m.formErrorWithPostponeOption,
            )}
          />
        </Box>
      )}

      {!isPostponed && (
        <Box>
          <Text variant="h4" marginBottom={2}>
            {formatMessage(m.formTitle)}
          </Text>
          <Stack space={2}>
            <InputController
              id={`${FIELD_NAME}.reason`}
              name={`${FIELD_NAME}.reason`}
              label={formatMessage(m.reasonLabel)}
              textarea
              backgroundColor="blue"
              error={reasonError}
            />
            <InputController
              id={`${FIELD_NAME}.action`}
              name={`${FIELD_NAME}.action`}
              label={formatMessage(m.actionLabel)}
              textarea
              backgroundColor="blue"
              error={actionError}
            />
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '6/12']}>
                <InputController
                  id={`${FIELD_NAME}.signatureName`}
                  name={`${FIELD_NAME}.signatureName`}
                  label={formatMessage(m.signatureNameLabel)}
                  backgroundColor="blue"
                  error={signatureNameError}
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <InputController
                  id={`${FIELD_NAME}.signatureRole`}
                  name={`${FIELD_NAME}.signatureRole`}
                  label={formatMessage(m.signatureRoleLabel)}
                  backgroundColor="blue"
                  error={signatureRoleError}
                />
              </GridColumn>
            </GridRow>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
