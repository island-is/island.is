import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateHealthConversationTextContent {
  // No @Field() — never exposed in the schema. Set by the mapper so the
  // union's resolveType can read the variant instead of inspecting shape.
  typename?: string

  @Field()
  text!: string
}
