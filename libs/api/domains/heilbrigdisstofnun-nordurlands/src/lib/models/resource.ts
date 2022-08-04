import { Field, ObjectType } from '@nestjs/graphql'

enum ResourceType {
  NUMBER_0 = 0,
  NUMBER_1 = 1,
  NUMBER_2 = 2,
  NUMBER_3 = 3,
  NUMBER_4 = 4,
}

@ObjectType()
export class Resource {
  @Field()
  resourceId?: number

  @Field()
  resourceName?: string

  @Field()
  resourceDescription?: string

  @Field()
  resourceType?: ResourceType

  @Field()
  resourceTypeDescription?: string

  @Field()
  groupId?: number

  @Field()
  groupName?: string

  @Field()
  groupAddress?: string

  @Field()
  groupDescription?: string

  @Field()
  maxBookingsPerPatient?: number

  @Field()
  description?: string
}
