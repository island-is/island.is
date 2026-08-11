import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { sortAlpha } from '@island.is/shared/utils'
import { FC, useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import type {
  ParsedCriterionDto,
  ParsedRoleDto,
} from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import {
  type Employee,
  type JobFactor,
  type Role,
  type SubCriterion,
} from '../../utils/types'
import { getPathValue } from '../../utils/answerHelpers'
import { RolePanel } from './RolePanel'
import {
  buildRolesFromEmployees,
  buildStepMetaByTitle,
  buildStepMetaFromSubCriteria,
} from './utils'

const byTitle = sortAlpha<Role>('title')

const FIELD_NAME = 'roles'

export const JobClassificationEditor: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { getValues, setValue } = useFormContext()

  const stepMetaByTitle = useMemo(() => {
    const criteria = getPathValue<ParsedCriterionDto[]>(
      application.externalData,
      'parsedSalaryReport.data.criteria',
      [],
    )
    const fromExternal = buildStepMetaByTitle(criteria)
    if (Object.keys(fromExternal).length > 0) return fromExternal
    // External data unavailable (stale right after import) — fall back to the
    // sub-criteria in answers so the step dropdowns still render options.
    const subCriteria = getPathValue<{
      jobFactors?: SubCriterion[][]
      personalFactors?: SubCriterion[][]
    }>(application.answers, 'subCriteria', {})
    return buildStepMetaFromSubCriteria(subCriteria)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Structure (titles + assignments): answers > external > derived from the
  // employees screen (manual entry has no dedicated "add role" UI, so roles
  // are inferred from job titles + the manually-entered job-factor
  // sub-criteria). Sorted alphabetically (Icelandic collation) before the
  // seed effect below, so on-screen order and `roles.${roleIndex}` field
  // paths stay in sync.
  const roles = useMemo(() => {
    const saved = getPathValue<Role[]>(application.answers, FIELD_NAME, [])
    if (saved.length > 0) return [...saved].sort(byTitle)

    const external = getPathValue<ParsedRoleDto[]>(
      application.externalData,
      'parsedSalaryReport.data.roles',
      [],
    )
    if (external.length > 0) return [...external].sort(byTitle)

    const employees = getPathValue<Employee[]>(
      application.answers,
      'employees',
      [],
    )
    const jobFactors = getPathValue<JobFactor[]>(
      application.answers,
      'criteria.jobFactors',
      [],
    )
    const subCriteriaJobFactors = getPathValue<SubCriterion[][]>(
      application.answers,
      'subCriteria.jobFactors',
      [],
    )
    const derived = buildRolesFromEmployees(
      employees.map((e) => e.roleTitle),
      jobFactors.map((f) => f.title),
      subCriteriaJobFactors,
    )
    return [...derived].sort(byTitle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Seed the full roles object into the form so the complete record (title,
  // criterionTitle, subTitle, stepOrder) is submitted — the per-step Select
  // controllers only register `stepOrder`. Always rebuilds from the seed
  // source, overlaying any stepOrder already in the form (matched by role
  // title) so in-session edits survive. Idempotent under StrictMode.
  useEffect(() => {
    if (roles.length === 0) return
    const current = getValues(FIELD_NAME) as Role[] | undefined
    const currentByTitle = new Map(
      (current ?? []).map((role) => [role.title, role]),
    )
    const merged = roles.map((role) => {
      const currentRole = currentByTitle.get(role.title)
      return {
        ...role,
        stepAssignments: role.stepAssignments.map((assignment, ai) => ({
          ...assignment,
          stepOrder:
            currentRole?.stepAssignments?.[ai]?.stepOrder ??
            assignment.stepOrder,
        })),
      }
    })
    setValue(FIELD_NAME, merged)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (roles.length === 0) {
    return (
      <Box>
        <AlertMessage
          type="info"
          message={formatMessage(
            messages.report.jobClassification.noRolesMessage,
          )}
        />
      </Box>
    )
  }

  return (
    <Box>
      <Stack space={2}>
        {roles.map((role, index) => (
          <RolePanel
            key={`${role.title}-${index}`}
            role={role}
            roleIndex={index}
            stepMetaByTitle={stepMetaByTitle}
            startExpanded={index === 0}
          />
        ))}
      </Stack>
    </Box>
  )
}
