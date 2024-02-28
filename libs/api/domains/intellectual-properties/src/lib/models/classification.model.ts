import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('IntellectualPropertiesClassification')
export class Classification {
  @Field()
  category!: string

  @Field({ nullable: true })
  creationDate?: Date

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  publicationDate?: Date

  @Field({ nullable: true })
  sequence?: number
}
