import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType('NationalRegistryV3ChildGuardianship')
export class ChildGuardianship {
  @Field(() => ID)
  childNationalId!: string

  @Field(() => [String], { nullable: true })
  legalDomicileParent?: Array<string> | undefined

  @Field(() => [String], { nullable: true })
  residenceParent?: Array<string> | undefined
}
