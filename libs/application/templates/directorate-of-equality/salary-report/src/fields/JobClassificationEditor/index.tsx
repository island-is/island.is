import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
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
import { RolePanel } from './RolePanel'
import {
  buildMergedStepMetaByTitle,
  buildRolesFromEmployees,
  buildStepAssignmentsFromSubCriteria,
  mergeStepAssignments,
} from './utils'

const FIELD_NAME = 'roles'

export const JobClassificationEditor: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { getValues, setValue } = useFormContext()

  const stepMetaByTitle = useMemo(() => {
    const criteria = (getValueViaPath<ParsedCriterionDto[]>(
      application.externalData,
      'parsedSalaryReport.data.criteria',
      [],
    ) ?? []) as ParsedCriterionDto[]
    // Live sub-criteria are the base (so a criterion added after import still
    // gets metadata) — the imported external criteria overlay authoritative
    // scores/weights for titles that exist in both.
    const jobFactors = (getValueViaPath<SubCriterion[][]>(
      application.answers,
      'subCriteria.jobFactors',
      [],
    ) ?? []) as SubCriterion[][]
    return buildMergedStepMetaByTitle(criteria, jobFactors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Structure (titles + assignments) for rendering: answers > external > derived.
  // Sorted alphabetically by title (Icelandic collation) — the sort happens
  // here, before the form-seeding effect below, so the on-screen order and
  // the `roles.${roleIndex}` field paths stay in sync.
  const roles = useMemo(() => {
    const jobFactors = (getValueViaPath<JobFactor[]>(
      application.answers,
      'criteria.jobFactors',
      [],
    ) ?? []) as JobFactor[]
    const subCriteriaJobFactors = (getValueViaPath<SubCriterion[][]>(
      application.answers,
      'subCriteria.jobFactors',
      [],
    ) ?? []) as SubCriterion[][]
    const defaultAssignments = buildStepAssignmentsFromSubCriteria(
      jobFactors.map((f) => f.title),
      subCriteriaJobFactors,
    )

    const saved = getValueViaPath<Role[]>(application.answers, FIELD_NAME)
    const bySavedOrExternalOrDerived = (): Role[] => {
      if (saved && saved.length > 0) return saved
      const external = (getValueViaPath<ParsedRoleDto[]>(
        application.externalData,
        'parsedSalaryReport.data.roles',
        [],
      ) ?? []) as Role[]
      if (external.length > 0) return external

      // No import ever ran (fully manual entry) — there's no dedicated UI for
      // creating roles, so derive them from the job titles already entered
      // on the employees screen, paired with the manually-entered
      // job-factor sub-criteria.
      const employees = (getValueViaPath<Employee[]>(
        application.answers,
        'employees',
        [],
      ) ?? []) as Employee[]
      return buildRolesFromEmployees(
        employees.map((e) => e.roleTitle),
        jobFactors.map((f) => f.title),
        subCriteriaJobFactors,
      )
    }

    // Merge newly-added job criteria into every role regardless of which
    // branch produced it, so criteria added after an import still get a row
    // for already-imported/saved roles, not just freshly-derived ones.
    const merged = bySavedOrExternalOrDerived().map((role) => ({
      ...role,
      stepAssignments: mergeStepAssignments(
        role.stepAssignments ?? [],
        defaultAssignments,
      ),
    }))
    return merged.sort((a, b) => a.title.localeCompare(b.title, 'is'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Seed the full roles object into the form so the complete record (title,
  // criterionTitle, subTitle, stepOrder) is submitted. The per-step Select
  // controllers register only `stepOrder`, so we cannot guard on
  // `getValues('roles').length` — that array is already non-empty (stepOrder
  // only) by the time this runs, which would leave the string fields undefined
  // and fail schema validation. Instead always rebuild the structure from the
  // seed source, overlaying any stepOrder already in the form so in-session
  // edits survive. Idempotent under StrictMode's double-invoked effects.
  useEffect(() => {
    if (roles.length === 0) return
    const current = getValues(FIELD_NAME) as Role[] | undefined
    const merged = roles.map((role, ri) => ({
      ...role,
      stepAssignments: role.stepAssignments.map((assignment, ai) => ({
        ...assignment,
        stepOrder:
          (current?.[ri]?.stepAssignments?.[ai]?.stepOrder as
            | number
            | undefined) ?? assignment.stepOrder,
      })),
    }))
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
