import { Locale } from '@island.is/shared/types'
import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType('WorkMachinesTypeClassificationInput')
export class GetWorkMachineTypeClassificationInput {
  @Field()
  @IsString()
  typeName!: string

  @Field()
  @IsString()
  locale!: Locale

  @Field()
  @IsString()
  @IsOptional()
  correlationId?: string
}
