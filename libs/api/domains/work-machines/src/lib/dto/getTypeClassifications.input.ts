import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { IsLocale } from '@island.is/nest/core'

@InputType('WorkMachinesTypeClassificationsInput')
export class GetWorkMachineTypeClassificationsInput {
  @Field({ nullable: true })
  @IsLocale()
  @IsOptional()
  locale?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  correlationId?: string
}
