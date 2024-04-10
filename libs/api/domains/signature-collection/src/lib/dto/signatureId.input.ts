import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SignatureCollectionSignatureIdInput {
  @Field()
  @IsString()
  signatureId!: string
}
