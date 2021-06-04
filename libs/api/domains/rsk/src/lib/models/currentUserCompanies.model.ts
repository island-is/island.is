import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CurrentUserCompanies {
  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field()
  operationalForm!: string

  @Field()
  companyStatus!: string

  @Field()
  isPartOfBoardOfDirectors!: boolean

  @Field()
  hasProcuration!: boolean
}
