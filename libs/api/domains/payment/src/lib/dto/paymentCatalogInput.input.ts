import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class PaymentCatalogInput {
  @Field((_) => String, { nullable: true })
  performingOrganizationID?: string
}
