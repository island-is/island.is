import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectoratePatientDataApprovalCountry')
export class Country {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field()
  code!: string
}

@ObjectType('HealthDirectoratePatientDataApprovalCountries')
export class Countries {
  @Field(() => [Country])
  data!: Country[]
}
