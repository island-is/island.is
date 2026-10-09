import {
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system-web/src/graphql/schema'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'

export const shouldShowPoliceDigitalCaseFilesSection = (
  user: User | undefined,
  digitalCaseFiles: unknown[] | null | undefined,
  digitalCaseFilesLoading: boolean,
): boolean =>
  (isProsecutionUser(user) ||
    isDistrictCourtUser(user) ||
    isCourtOfAppealsUser(user)) &&
  (digitalCaseFilesLoading || isNonEmptyArray(digitalCaseFiles))
