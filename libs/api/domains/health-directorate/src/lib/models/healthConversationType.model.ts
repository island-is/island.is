import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateHealthConversationType {
  @Field({
    description:
      'PatientInitiatedConversationType code (e.g. TREATMENT_FOLLOWUP). Pass this back when creating a message.',
  })
  patientInitiatedTypeCode!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description?: string

  @Field({
    description:
      'True for certificate-request types (use POST /certificates); false for regular messages.',
  })
  isCertificate!: boolean
}
