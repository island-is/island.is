import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { IsLocale } from '@island.is/nest/core'

@InputType('WorkMachinesTypeClassificationInput')
export class GetWorkMachineTypeClassificationInput {
  @Field()
  @IsString()
  typeName!: string

  @Field()
  @IsLocale()
  locale!: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  correlationId?: string
}
