import { FC, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { getValueViaPath } from '@island.is/application/core'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  GridColumn,
  GridRow,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { formatCurrency } from '../EmployeesEditor/utils'
import { OutlierGroupPanel } from './OutlierGroupPanel'

interface Props extends FieldBaseProps {
  field: CustomField
}

export const SalaryAnalysisResults: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  errors,
}) => {
  const hidePostponeCheckbox =
    field?.props && typeof field.props['hidePostponeCheckbox'] === 'boolean'
      ? (field.props['hidePostponeCheckbox'] as boolean)
      : false
  const { formatMessage, lang: locale } = useLocale()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [result, setResult] = useState<SalaryAnalysisResponseDto | undefined>(
    () =>
      getValueViaPath<SalaryAnalysisResponseDto>(
        application.externalData,
        'salaryAnalysisResult.data',
      ),
  )

  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setHasError(false)
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
      const data = res.data?.updateApplicationExternalData.externalData
        ?.salaryAnalysisResult?.data as SalaryAnalysisResponseDto | undefined
      if (data) {
        setResult(data)
      } else {
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
            message={formatMessage(
              messages.salaryAnalysis.results.analyzeError,
            )}
          />
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
        hidePostponeCheckbox={hidePostponeCheckbox}
        errors={errors}
      />
    </Box>
  )
}
