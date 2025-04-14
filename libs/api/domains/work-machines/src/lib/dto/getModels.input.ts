import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('WorkMachinesModelsInput')
export class GetWorkMachineModelsInput {
  @Field({})
  @IsString()
  type!: string
}
