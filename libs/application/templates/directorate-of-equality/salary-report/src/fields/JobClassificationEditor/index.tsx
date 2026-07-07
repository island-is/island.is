import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Stack } from '@island.is/island-ui/core'
import { FC, useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import type {
  ParsedCriterionDto,
  ParsedRoleDto,
} from '@island.is/clients/directorate-of-equality'
import { type Role, type SubCriterion } from '../../lib/constants'
import { RolePanel } from './RolePanel'
import { buildStepMetaByTitle, buildStepMetaFromSubCriteria } from './utils'

const FIELD_NAME = 'roles'

export const JobClassificationEditor: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { getValues, setValue } = useFormContext()

  const stepMetaByTitle = useMemo(() => {
    const criteria = (getValueViaPath<ParsedCriterionDto[]>(
      application.externalData,
      'parsedSalaryReport.data.criteria',
      [],
    ) ?? []) as ParsedCriterionDto[]
    const fromExternal = buildStepMetaByTitle(criteria)
    if (Object.keys(fromExternal).length > 0) return fromExternal
    // External data unavailable (stale right after import) — fall back to the
    // sub-criteria in answers so the step dropdowns still render options.
    const subCriteria = (getValueViaPath(application.answers, 'subCriteria', {}) ??
      {}) as { jobFactors?: SubCriterion[][]; personalFactors?: SubCriterion[][] }
    return buildStepMetaFromSubCriteria(subCriteria)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Structure (titles + assignments) for rendering: answers > external > empty.
  const roles = useMemo(() => {
    const saved = getValueViaPath<Role[]>(application.answers, FIELD_NAME)
    if (saved && saved.length > 0) return saved
    return (getValueViaPath<ParsedRoleDto[]>(
      application.externalData,
      'parsedSalaryReport.data.roles',
      [],
    ) ?? []) as Role[]
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
