import {
  Feature,
  isIndictmentCase,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type { User } from '@island.is/judicial-system-web/src/graphql/schema'

export const showsPublicProsecutorVerdictAppealStep = (
  workingCase: Pick<WorkingCase, 'type' | 'verdictAppealCase'>,
  user: User | undefined,
  features: Feature[],
  isRegisteringVerdictAppeal = false,
): boolean =>
  features.includes(Feature.INDICTMENT_APPEAL) &&
  isIndictmentCase(workingCase.type) &&
  isPublicProsecutionOfficeUser(user) &&
  (Boolean(workingCase.verdictAppealCase) || isRegisteringVerdictAppeal)
