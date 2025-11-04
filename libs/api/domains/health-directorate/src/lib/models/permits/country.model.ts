import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectoratePatientDataApprovalCountry')
export class Country {
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
