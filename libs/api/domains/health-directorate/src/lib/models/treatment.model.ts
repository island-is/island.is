import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateTreatment {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  organizationName?: string

  @Field({ nullable: true })
  departmentName?: string

  @Field({
    description:
      'True when the care team allows sending messages within this treatment.',
  })
  supportsMessaging!: boolean

  @Field({
    nullable: true,
    description:
      'Node of the provider responsible for the treatment; matches a messaging recipient nodeId. Present whenever messaging is allowed.',
  })
  responsibleNode?: string
}
