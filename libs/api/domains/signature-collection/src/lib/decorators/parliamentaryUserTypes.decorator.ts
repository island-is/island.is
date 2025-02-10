import { SetMetadata } from '@nestjs/common'
import {
  ALLOW_DELEGATION_KEY,
  RESTRICT_GUARANTOR_KEY,
} from '../guards/constants'
// ---------------
// ---Guarantor---
// ---------------
// A guarantor is a user in the signature collection system, aimed at parliamentary collections.
// A guarantor (is: Ábyrgðaraðili) defined by Þjóðskrá Íslands as one of the following :
//      - A holder of procuration
//   OR - A direct candidate in the party ballot

export const RestrictGuarantor = () => SetMetadata(RESTRICT_GUARANTOR_KEY, true)

// ---------------
// ----Manager----
// ---------------
// A manager is a user in the signature collection system, aimed at parliamentary collections.
// A manager (is: Umsjónaraðili) defined by Þjóðskrá Íslands as one of the following:
//      - Individuals delegated to a company without having a procuration role
//   OR - Individuals delegated to a person (possibly a list owner)

// This is the same as the allow_delegation rule so no new constants are needed
export const AllowManager = () => SetMetadata(ALLOW_DELEGATION_KEY, true)

// Assumptions: Guarantors have access to everything unless otherwise stated
//              Managers have access to nothing unless otherwise stated
