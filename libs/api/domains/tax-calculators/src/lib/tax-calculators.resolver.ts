import { Resolver } from '@nestjs/graphql'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'

/* Intentionally empty. The previous `taxCalculatorFields` query served a
 * hardcoded field list that did not match RSK's own input contract; it was
 * removed rather than left to drift further. A resolver contributing no
 * fields adds nothing to the schema, so this class is a placeholder for the
 * rebuild against @island.is/clients/rsk/calculators -- see the README. */
@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver()
export class TaxCalculatorsResolver {}
