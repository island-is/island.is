import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class QualityPhoto {
  @Field()
  qualityphoto!: string
}
