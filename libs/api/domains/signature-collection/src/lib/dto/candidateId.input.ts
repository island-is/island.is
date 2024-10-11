import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SignatureCollectionCandidateIdInput {
  @Field()
  @IsString()
  candidateId!: string
}
