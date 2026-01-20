import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionBaseInput } from './signatureCollectionBase.input'

@InputType()
export class SignatureCollectionCandidateIdInput extends SignatureCollectionBaseInput {
  @Field()
  @IsString()
  candidateId!: string
}
