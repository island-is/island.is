import { Allow, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType('IntellectualPropertyPatentInput')
export class GetPatentInput {
  @Allow()
  @Field()
  @IsString()
  applicationId!: string
}
