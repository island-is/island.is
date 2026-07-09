import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { messages } from '../../lib/messages'
import type { ParsedCriterionDto } from '@island.is/clients/directorate-of-equality'
import { DEFAULT_JOB_FACTORS } from '../../utils/constants'
import type { JobFactor, PersonalFactor, SubCriterion } from '../../utils/types'
import { CriterionPanel } from './CriterionPanel'

export const SubCriteriaEditor: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const parsedSalaryReportDate = getValueViaPath<string>(
    application.externalData,
    'parsedSalaryReport.date',
  )

  const parsedCriteria = (getValueViaPath<ParsedCriterionDto[]>(
    application.externalData,
    'parsedSalaryReport.data.criteria',
    [],
  ) ?? []) as ParsedCriterionDto[]

  const jobFactors = (getValueViaPath<JobFactor[]>(
    application.answers,
    'criteria.jobFactors',
  ) ?? DEFAULT_JOB_FACTORS) as JobFactor[]

  const personalFactors = (getValueViaPath<PersonalFactor[]>(
    application.answers,
    'criteria.personalFactors',
  ) ?? []) as PersonalFactor[]

  const parsedPersonalCriteria = parsedCriteria.filter(
    (c) => c.type === 'PERSONAL',
  )

  const savedJobSubCriteria = (getValueViaPath<SubCriterion[][]>(
    application.answers,
    'subCriteria.jobFactors',
  ) ?? []) as SubCriterion[][]

  const savedPersonalSubCriteria = (getValueViaPath<SubCriterion[][]>(
    application.answers,
    'subCriteria.personalFactors',
  ) ?? []) as SubCriterion[][]

  return (
    <Box>
      <Stack space={4}>
        <Box>
          <Text variant="h4" marginBottom={1}>
            {formatMessage(messages.report.subCriteria.jobFactorGroupTitle)}
          </Text>
          <Text marginBottom={3}>
            {formatMessage(messages.report.subCriteria.jobFactorGroupIntro)}
          </Text>
          <Stack space={3}>
            {jobFactors.map((factor, i) => {
              const parsedCriterion = parsedCriteria.find(
                (c) => c.type === factor.type,
              )
              return (
                <CriterionPanel
                  key={factor.type}
                  accordionId={`subCriteria-jobFactor-${factor.type}`}
                  criterionTitle={factor.title}
                  criterionWeight={factor.weight}
                  fieldName={`subCriteria.jobFactors.${i}`}
                  savedSubCriteria={savedJobSubCriteria[i] ?? []}
                  parsedSubCriteria={parsedCriterion?.subCriteria ?? []}
                  parsedSalaryReportDate={parsedSalaryReportDate}
                  startExpanded={i === 0}
                />
              )
            })}
          </Stack>
        </Box>

        {personalFactors.length > 0 && (
          <Box>
            <Text variant="h4" marginBottom={1}>
              {formatMessage(
                messages.report.subCriteria.personalFactorGroupTitle,
              )}
            </Text>
            <Text marginBottom={3}>
              {formatMessage(
                messages.report.subCriteria.personalFactorGroupIntro,
              )}
            </Text>
            <Stack space={3}>
              {personalFactors.map((factor, i) => {
                const parsedCriterion = parsedPersonalCriteria.find(
                  (c) => c.title === factor.title,
                )
                return (
                  <CriterionPanel
                    key={`personal-${i}`}
                    accordionId={`subCriteria-personalFactor-${i}`}
                    criterionTitle={factor.title}
                    criterionWeight={factor.weight}
                    fieldName={`subCriteria.personalFactors.${i}`}
                    savedSubCriteria={savedPersonalSubCriteria[i] ?? []}
                    parsedSubCriteria={parsedCriterion?.subCriteria ?? []}
                    parsedSalaryReportDate={parsedSalaryReportDate}
                    startExpanded={i === 0}
                  />
                )
              })}
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  )
}
