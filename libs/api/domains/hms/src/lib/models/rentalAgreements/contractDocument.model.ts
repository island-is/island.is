import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsContractDocument')
export class ContractDocument {
  @Field(() => ID)
  id!: number

  @Field()
  name!: string

  @Field({ nullable: true })
  mime?: string

  @Field({ nullable: true })
  downloadUrl?: string
}
