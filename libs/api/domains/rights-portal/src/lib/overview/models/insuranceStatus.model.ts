import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalInsuranceStatus')
export class InsuranceStatus {
  @Field(() => String, { nullable: true })
  display?: string | null

  @Field(() => String, { nullable: true })
  code?: string | null
}
