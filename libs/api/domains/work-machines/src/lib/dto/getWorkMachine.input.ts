import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('WorkMachinesWorkMachineInput')
export class GetWorkMachineInput {
  @Field()
  @IsString()
  id!: string

  @Field(() => String)
  @IsString()
  locale!: string
}
