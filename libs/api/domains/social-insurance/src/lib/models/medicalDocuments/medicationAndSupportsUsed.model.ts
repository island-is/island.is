import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicationAndSupportsUsed')
export class MedicationAndSupportsUsed {
  @Field({ nullable: true })
  medicationUsed?: string

  @Field({ nullable: true })
  supportsUsed?: string

  @Field({ nullable: true })
  interventionsUsed?: string
}
