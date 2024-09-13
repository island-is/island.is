import { OmitType, PartialType } from '@nestjs/mapped-types'

import { CreateCivilClaimantDto } from './createCivilClaimant.dto'

export class UpdateCivilClaimantDto extends PartialType(
  OmitType(CreateCivilClaimantDto, ['caseId'] as const),
) {}
