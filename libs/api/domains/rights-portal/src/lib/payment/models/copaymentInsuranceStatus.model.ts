import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('RightsPortalCopaymentInsuranceStatus')
export class CopaymentInsuranceStatus {
  @Field(() => String, { nullable: true })
  display?: string | null

  @Field(() => String, { nullable: true })
  code?: string | null
}
