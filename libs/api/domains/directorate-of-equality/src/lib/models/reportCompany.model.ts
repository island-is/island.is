import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('DirectorateOfEqualityReportCompany')
export class ReportCompany {
  @Field(() => String)
  name!: string

  @Field(() => String, {
    description: 'Company kennitala, 10 digits, no hyphen',
  })
  nationalId!: string
}
