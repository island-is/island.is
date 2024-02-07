import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('IntellectualPropertiesPCT')
export class PCT {
  @Field({ nullable: true })
  number?: string

  @Field({ nullable: true })
  date?: Date
}
