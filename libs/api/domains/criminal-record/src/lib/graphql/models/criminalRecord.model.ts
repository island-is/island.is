import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class CriminalRecord {
  @Field()
  contentBase64!: string
}
