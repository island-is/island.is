import {
  type InstitutionUser,
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'

export const shouldShowPoliceDigitalCaseFilesSection = (
  user: InstitutionUser | undefined,
  digitalCaseFiles: unknown[] | null | undefined,
  digitalCaseFilesLoading: boolean,
): boolean =>
  (isProsecutionUser(user) ||
    isDistrictCourtUser(user) ||
    isCourtOfAppealsUser(user)) &&
  (digitalCaseFilesLoading || isNonEmptyArray(digitalCaseFiles))
