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
  buildMergedStepMetaByTitle,
  buildRolesFromEmployees,
  buildStepAssignmentsFromSubCriteria,
  mergeStepAssignments,
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
    // Live sub-criteria are the base (so a criterion added after import still
    // gets metadata) — the imported external criteria overlay authoritative
    // scores/weights for titles that exist in both.
    const jobFactors = getPathValue<SubCriterion[][]>(
      application.answers,
      'subCriteria.jobFactors',
      [],
    )
    return buildMergedStepMetaByTitle(criteria, jobFactors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Structure (titles + assignments): answers > external > derived from the
  // employees screen (manual entry has no dedicated "add role" UI, so roles
  // are inferred from job titles + the manually-entered job-factor
  // sub-criteria). Sorted alphabetically (Icelandic collation) before the
  // seed effect below, so on-screen order and `roles.${roleIndex}` field
  // paths stay in sync. Merges newly-added job criteria into every role
  // regardless of which branch produced it, so criteria added after an
  // import still get a row for already-imported/saved roles too.
  const roles = useMemo(() => {
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
    const defaultAssignments = buildStepAssignmentsFromSubCriteria(
      jobFactors.map((f) => f.title),
      subCriteriaJobFactors,
    )
    const mergeDefaults = (role: Role): Role => ({
      ...role,
      stepAssignments: mergeStepAssignments(
        role.stepAssignments ?? [],
        defaultAssignments,
      ),
    })

    const saved = getPathValue<Role[]>(application.answers, FIELD_NAME, [])
    if (saved.length > 0) return saved.map(mergeDefaults).sort(byTitle)

    const external = getPathValue<ParsedRoleDto[]>(
      application.externalData,
      'parsedSalaryReport.data.roles',
      [],
    ) as Role[]
    if (external.length > 0) return external.map(mergeDefaults).sort(byTitle)

    // No import ever ran (fully manual entry) — there's no dedicated UI for
    // creating roles, so derive them from the job titles already entered on
    // the employees screen, paired with the manually-entered job-factor
    // sub-criteria.
    const employees = getPathValue<Employee[]>(
      application.answers,
      'employees',
      [],
    )
    const derived = buildRolesFromEmployees(
      employees.map((e) => e.roleTitle),
      jobFactors.map((f) => f.title),
      subCriteriaJobFactors,
    )
    return derived.map(mergeDefaults).sort(byTitle)
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
