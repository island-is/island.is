import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('GetMachineParentCategoryByTypeAndModelInput')
export class GetMachineParentCategoryByTypeAndModelInput {
  @Field()
  @IsString()
  type!: string

  @Field(() => String)
  @IsString()
  model!: string
}
