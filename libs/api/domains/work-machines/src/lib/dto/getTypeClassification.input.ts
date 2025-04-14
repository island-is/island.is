import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('WorkMachinesTypeClassificationInput')
export class GetWorkMachineTypeClassificationInput {
  @Field()
  @IsString()
  typeName!: string

  @Field()
  @IsString()
  locale!: string
}
