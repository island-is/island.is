import { Allow, IsOptional, IsString } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class RequestSignatureInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly method?: 'audkenni' | 'mobile'
}
