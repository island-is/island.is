import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('WorkMachinesInput')
export class GetWorkMachineInput {
  @Field()
  @IsString()
  id!: string

  @Field(() => String)
  @IsString()
  locale!: string
}
