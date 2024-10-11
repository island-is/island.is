import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalInsuranceConfirmation')
export class InsuranceConfirmation {
  @Field()
  fileName!: string

  @Field()
  contentType!: string

  @Field()
  data!: string
}
