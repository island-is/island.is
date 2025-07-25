import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { IsLocale } from '@island.is/nest/core'

@InputType('WorkMachineTypeClassificationInput')
export class GetWorkMachineTypeClassificationInput {
  @Field()
  @IsString()
  type!: string

  @Field({ nullable: true })
  @IsLocale()
  @IsOptional()
  locale?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  correlationId?: string
}
