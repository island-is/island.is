import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsRentalAgreementDocument')
export class ContractDocument {
  @Field(() => ID)
  id!: number

  @Field()
  name!: string

  @Field({ nullable: true })
  downloadUrl?: string
}
