import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DraftRegulationModel {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  drafting_status?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  text?: string

  @Field({ nullable: true })
  drafting_notes?: string

  @Field({ nullable: true })
  ideal_publish_date?: string

  @Field({ nullable: true })
  ministry_id?: string

  @Field({ nullable: true })
  signature_date?: string

  @Field({ nullable: true })
  effective_date?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  created?: string

  @Field({ nullable: true })
  modified?: string
}
