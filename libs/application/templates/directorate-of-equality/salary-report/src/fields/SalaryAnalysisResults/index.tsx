import { FC, useEffect, useMemo, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { getValueViaPath, YES } from '@island.is/application/core'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { isOutlierGroupComplete } from '../../utils/outlierGroups'
import type { OutlierGroupAnswer } from '../../utils/outlierGroups'
import { formatCurrency } from '../EmployeesEditor/utils'
import { OutlierGroupPanel } from './OutlierGroupPanel'

interface Props extends FieldBaseProps {
  field: CustomField
}

// Shape written by templateApiActionRunner.service.ts's buildExternalData —
// `reason` is already localized server-side (via formatMessage using the
// application's locale) before it reaches the client.
type AnalysisExternalData = {
  status?: 'success' | 'failure'
  data?: SalaryAnalysisResponseDto
  reason?: { title?: string; summary?: string } | string[]
}

const getErrorMessage = (
  reason: AnalysisExternalData['reason'],
): string | undefined => {
  if (!reason) return undefined
  if (Array.isArray(reason)) return reason.join(', ')
  return reason.summary || reason.title
}

export const SalaryAnalysisResults: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  errors,
  setBeforeSubmitCallback,
}) => {
  const hidePostponeCheckbox =
    field?.props && typeof field.props['hidePostponeCheckbox'] === 'boolean'
      ? (field.props['hidePostponeCheckbox'] as boolean)
      : false
  const { formatMessage, lang: locale } = useLocale()
  const postponed: string[] =
    useWatch({ name: 'salaryAnalysis.postponed' }) ?? []
  const isPostponed = postponed.includes(YES)
  const watchedOutlierGroups: OutlierGroupAnswer[] = useWatch({
    name: 'salaryAnalysis.outlierGroups',
  })
  const outlierGroups = useMemo(() => watchedOutlierGroups ?? [], [
    watchedOutlierGroups,
  ])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [result, setResult] = useState<SalaryAnalysisResponseDto | undefined>(
    () => {
      const initial = getValueViaPath<AnalysisExternalData>(
        application.externalData,
        'salaryAnalysisResult',
      )
      return initial?.status === 'success' ? initial.data : undefined
    },
  )

  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setHasError(false)
    setErrorMessage(undefined)
    try {
      const res = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              {
                actionId: 'DirectorateOfEquality.analyzeSalaryReport',
                order: 0,
              },
            ],
          },
          locale,
        },
      })
      const salaryAnalysisResult = res.data?.updateApplicationExternalData
        .externalData?.salaryAnalysisResult as AnalysisExternalData | undefined
      if (
        salaryAnalysisResult?.status === 'success' &&
        salaryAnalysisResult.data
      ) {
        setResult(salaryAnalysisResult.data)
      } else {
        setErrorMessage(getErrorMessage(salaryAnalysisResult?.reason))
        setHasError(true)
      }
    } catch {
      setHasError(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Run automatically on arrival at this screen — the applicant shouldn't
  // have to press a button to see results. Only fires when there's no
  // existing result yet (e.g. from a prior visit to this screen).
  useEffect(() => {
    if (result) return
    handleAnalyze()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Block "Continue" while the analysis hasn't succeeded yet — either still
  // running (guards a race if the applicant clicks through before it
  // finishes) or failed. There's no buildSubmitField on this screen, so this
  // is the only gate available. Re-registers whenever the outcome changes so
  // the callback always checks the current state, not a stale closure.
  useEffect(() => {
    if (!setBeforeSubmitCallback) return
    setBeforeSubmitCallback(async () => {
      if (isAnalyzing) {
        return [false, formatMessage(messages.salaryAnalysis.results.analyzing)]
      }
      if (hasError) {
        return [
          false,
          errorMessage ??
            formatMessage(messages.salaryAnalysis.results.analyzeError),
        ]
      }
      // Postponing the improvement plan exempts the applicant from grouping
      // and explaining outliers here entirely — same exemption the schema
      // already applies (see dataSchema's superRefine).
      const currentOutliers = result?.outliers ?? []
      if (!isPostponed && currentOutliers.length > 0) {
        const assignedOrdinals = new Set(
          outlierGroups.flatMap((g) => g.employeeOrdinals),
        )
        const allOutliersAssigned = currentOutliers.every((o) =>
          assignedOrdinals.has(o.employeeOrdinal),
        )
        if (!allOutliersAssigned) {
          return [
            false,
            formatMessage(
              messages.salaryAnalysis.outlierGroup.unassignedWarning,
            ),
          ]
        }
        const groupsComplete = outlierGroups.every(isOutlierGroupComplete)
        if (!groupsComplete) {
          return [
            false,
            formatMessage(
              messages.salaryAnalysis.outlierGroup.incompleteGroupWarning,
            ),
          ]
        }
      }
      return [true, null]
    })
  }, [
    setBeforeSubmitCallback,
    isAnalyzing,
    hasError,
    errorMessage,
    formatMessage,
    isPostponed,
    outlierGroups,
    result,
  ])

  const totals = result?.baseSalaryByGenderAndScoreAll?.totals
  const outlierCount = result?.outliers?.length ?? 0

  return (
    <Box>
      {isAnalyzing && (
        <Box display="flex" justifyContent="center" paddingY={5}>
          <LoadingDots />
        </Box>
      )}

      {hasError && (
        <Box marginBottom={3}>
          <AlertMessage
            type="error"
            message={
              errorMessage ??
              formatMessage(messages.salaryAnalysis.results.analyzeError)
            }
          />
          <Box marginTop={2}>
            <Button
              variant="ghost"
              size="small"
              icon="reload"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {formatMessage(messages.salaryAnalysis.results.recalculateButton)}
            </Button>
          </Box>
        </Box>
      )}

      {totals && (
        <Box marginBottom={4}>
          <Text variant="h4" marginBottom={2}>
            {formatMessage(messages.salaryAnalysis.results.totalsTitle)}
          </Text>
          <GridRow rowGap={2}>
            <GridColumn span={['12/12', '4/12']}>
              <Text variant="eyebrow">
                {formatMessage(messages.salaryAnalysis.results.maleLabel)}
              </Text>
              <Text variant="h3">
                {formatCurrency(totals.maleAverageSalary)}
              </Text>
            </GridColumn>
            <GridColumn span={['12/12', '4/12']}>
              <Text variant="eyebrow">
                {formatMessage(messages.salaryAnalysis.results.femaleLabel)}
              </Text>
              <Text variant="h3">
                {formatCurrency(totals.femaleAverageSalary)}
              </Text>
            </GridColumn>
          </GridRow>
          {typeof totals.wageGapPercent === 'number' && (
            <Box marginTop={3}>
              <Text variant="eyebrow">
                {formatMessage(messages.salaryAnalysis.results.wageGapLabel)}
              </Text>
              <Text variant="h3">{totals.wageGapPercent.toFixed(1)}%</Text>
            </Box>
          )}
        </Box>
      )}

      {result &&
        (outlierCount > 0 ? (
          <AlertMessage
            type="warning"
            title={formatMessage(
              messages.salaryAnalysis.results.outliersFoundTitle,
              { count: outlierCount },
            )}
            message={formatMessage(
              messages.salaryAnalysis.results.outliersFoundDescription,
            )}
          />
        ) : (
          <AlertMessage
            type="success"
            message={formatMessage(
              messages.salaryAnalysis.results.noOutliersFound,
            )}
          />
        ))}

      <OutlierGroupPanel
        application={application}
        outliers={result?.outliers ?? []}
        scoreBuckets={result?.baseSalaryByGenderAndScoreAll?.scoreBuckets ?? []}
        hidePostponeCheckbox={hidePostponeCheckbox}
        errors={errors}
      />
    </Box>
  )
}
