import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('WorkMachinesParentCategoryByTypeAndModelInput')
export class GetMachineParentCategoryByTypeAndModelInput {
  @Field()
  @IsString()
  type!: string

  @Field()
  @IsString()
  model!: string
}
