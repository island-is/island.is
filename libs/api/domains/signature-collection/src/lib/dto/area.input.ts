import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AreaInput {
  @Field()
  @IsString()
  areaId!: string
}
