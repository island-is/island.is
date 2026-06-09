import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { messages } from '../../lib/messages'
import type { ParsedCriterionDto } from '@island.is/clients/directorate-of-equality'
import { CriteriaItem } from './CriteriaItem'
import { PersonalCriteriaList } from './PersonalCriteriaList'
import { DEFAULT_JOB_FACTORS, type JobFactor } from '../../lib/constants'

export const CriteriaEditor: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  // Changes every time a new workbook is successfully processed
  const parsedSalaryReportDate = getValueViaPath<string>(
    application.externalData,
    'parsedSalaryReport.date',
  )

  useEffect(() => {
    // Answers are the source of truth — never overwrite saved answers
    const savedFactors = getValueViaPath<JobFactor[]>(
      application.answers,
      'criteria.jobFactors',
    )
    const hasFilledWeights = savedFactors?.some((f) => f.weight !== '')
    if (hasFilledWeights) return

    const parsedCriteria = getValueViaPath<ParsedCriterionDto[]>(
      application.externalData,
      'parsedSalaryReport.data.criteria',
      [],
    ) as ParsedCriterionDto[]

    const hasParsedData = parsedCriteria.length > 0

    // Build job factors: parsed Excel values take precedence over defaults
    const jobFactors = DEFAULT_JOB_FACTORS.map((defaultFactor) => {
      const parsed = parsedCriteria.find((c) => c.type === defaultFactor.type)
      return parsed
        ? {
            ...defaultFactor,
            title: parsed.title,
            description: parsed.description,
            weight: String(parsed.weight),
          }
        : defaultFactor
    })

    // Set each path individually — setting the whole array doesn't reliably
    // trigger re-renders in InputController components watching sub-paths
    jobFactors.forEach((factor, i) => {
      setValue(`criteria.jobFactors.${i}.type`, factor.type)
      setValue(`criteria.jobFactors.${i}.title`, factor.title)
      setValue(`criteria.jobFactors.${i}.description`, factor.description)
      setValue(`criteria.jobFactors.${i}.weight`, factor.weight)
    })

    if (hasParsedData) {
      const parsedPersonal = parsedCriteria
        .filter((c) => c.type === 'PERSONAL')
        .map((c) => ({
          title: c.title,
          description: c.description,
          weight: String(c.weight),
        }))
      if (parsedPersonal.length > 0) {
        setValue('criteria.personalFactors', parsedPersonal, { shouldDirty: true })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedSalaryReportDate])

  const jobFactors: JobFactor[] = useWatch({ name: 'criteria.jobFactors' }) ?? DEFAULT_JOB_FACTORS

  const personalFactors: { weight: string }[] = useWatch({ name: 'criteria.personalFactors' }) ?? []

  const totalWeight =
    [...jobFactors, ...personalFactors].reduce(
      (sum, f) => sum + (Number(f.weight) || 0),
      0,
    )

  return (
    <Box>
      <Text variant="h4" marginBottom={2}>
        {formatMessage(messages.report.criteria.jobFactorTitle)}
      </Text>
      <Text marginBottom={3}>
        {formatMessage(messages.report.criteria.jobFactorIntro)}
      </Text>

      <Box>
        {jobFactors.map((factor, i) => (
          <CriteriaItem
            key={factor.type}
            title={factor.title}
            description={factor.description}
            index={i}
            isLast={i === jobFactors.length - 1}
          />
        ))}
      </Box>

      <PersonalCriteriaList />

      {totalWeight !== 0 && totalWeight !== 100 && (
        <Box marginTop={3}>
          <Text color="red600">
            {formatMessage(messages.report.criteria.weightSumError, { total: totalWeight })}
          </Text>
        </Box>
      )}
    </Box>
  )
}
