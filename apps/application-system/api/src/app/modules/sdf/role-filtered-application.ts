import {
  ApplicationWithAttachments,
  ExternalData,
  FormValue,
} from '@island.is/application/types'

declare const roleFilteredBrand: unique symbol

/**
 * An application whose `answers`/`externalData` have already been through
 * `SdfScreenService.filterDataByRole`. Anything that renders field content
 * back to the client (screen/field mappers, `extractPageAnswers`) must
 * require this type instead of the raw `Application`/`ApplicationWithAttachments`.
 * The brand makes it a compile error to pass the unfiltered application by
 * mistake
 */
export type RoleFilteredApplication = Omit<
  ApplicationWithAttachments,
  'answers' | 'externalData'
> & {
  answers: FormValue
  externalData: ExternalData
  readonly [roleFilteredBrand]: true
}

export const toRoleFilteredApplication = (
  application: ApplicationWithAttachments,
  filteredAnswers: FormValue,
  filteredExternalData: ExternalData,
): RoleFilteredApplication =>
  ({
    ...application,
    answers: filteredAnswers,
    externalData: filteredExternalData,
  } as RoleFilteredApplication)
