import { ApiProperty, OmitType } from '@nestjs/swagger'
import { ApiScopeBaseDTO } from './base/api-scope-base.dto'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateApiScopeDTO extends OmitType(ApiScopeBaseDTO, [
  'supportedDelegationTypes',
  'grantToPersonalRepresentatives',
  'grantToProcuringHolders',
  'grantToLegalGuardians',
  'allowExplicitDelegationGrant',
  'grantToAuthenticatedUser',
  'automaticDelegationGrant',
  'alsoForDelegatedUser',
]) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_display_name',
  })
  readonly displayName!: string

  @IsString()
  @ApiProperty({
    example: 'set_description',
  })
  readonly description!: string
}
