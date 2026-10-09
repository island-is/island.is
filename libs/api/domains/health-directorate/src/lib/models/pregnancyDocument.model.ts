import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import { PregnancyDocumentKindEnum } from './enums'

@ObjectType('HealthDirectoratePregnancyDocument')
export class PregnancyDocument {
  @Field(() => ID)
  id!: string

  @Field(() => PregnancyDocumentKindEnum)
  kind!: PregnancyDocumentKindEnum

  @Field({ nullable: true })
  title?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date

  @Field({ nullable: true })
  organizationName?: string
}
