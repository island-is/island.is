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

  @Field({
    nullable: true,
    description:
      'Set for entries that link to an external service (e.g. the Heilsuvera web chat). Open this URL instead of creating a conversation.',
  })
  externalLinkUrl?: string

  @Field({
    nullable: true,
    description:
      'Whether the external service is open right now. Only set when externalLinkUrl is present.',
  })
  isCurrentlyOpen?: boolean
}
