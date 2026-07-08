import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectoratePrescriptionRenewalTarget')
export class PrescriptionRenewalTarget {
  @Field(() => Int)
  groupId!: number

  @Field()
  nodeId!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  description?: string
}
