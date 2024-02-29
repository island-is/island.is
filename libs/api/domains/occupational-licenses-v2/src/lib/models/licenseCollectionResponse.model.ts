import { Field, ObjectType } from '@nestjs/graphql'
import { License } from './license.model'

@ObjectType('OccupationalLicensesV2Collection')
export class LicensesCollection {
  @Field(() => [License], { nullable: true })
  health?: Array<License>

  @Field(() => [License], { nullable: true })
  education?: Array<License>

  @Field(() => [License], { nullable: true })
  districtCommissioners?: Array<License>
}
