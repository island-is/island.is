import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsDifficulty')
export class Difficulty {
  @Field(() => Int, { nullable: true })
  value?: number

  @Field({ nullable: true })
  displayValue?: string

  @Field({ nullable: true })
  explanation?: string
}
