import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SignatureCollectionAreaInput {
  @Field()
  @IsString()
  areaId!: string
}
