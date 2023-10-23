import { InputType, Field, ID } from '@nestjs/graphql'

@InputType('RightsPortalDrugCertificateInput')
export class DrugCertificateInput {
  @Field(() => Number)
  id!: number
}
