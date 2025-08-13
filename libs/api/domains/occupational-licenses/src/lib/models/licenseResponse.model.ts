import { Field, ObjectType } from '@nestjs/graphql'
import { License } from './license.model'
import { Link } from './link'

@ObjectType('OccupationalLicensesLicenseResponse')
export class LicenseResponse {
  @Field(() => License)
  license!: License

  @Field(() => [Link], { nullable: true })
  actions?: Array<Link>

  @Field({ nullable: true })
  headerText?: string

  @Field({ nullable: true })
  footerText?: string
}
