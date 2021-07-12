import { Field, ObjectType } from '@nestjs/graphql'
// import { ISODate } from '@island.is/regulations'

@ObjectType()
export class DraftRegulationModel {
  @Field()
  id!: string

  @Field({ name: 'draftingStatus', nullable: true })
  drafting_status!: string

  @Field({ name: 'draftingNotes', nullable: true })
  drafting_notes?: string

  @Field(() => [String], { nullable: true })
  authors!: string[]

  @Field({ nullable: true })
  title!: string

  @Field({ nullable: true })
  text?: string

  @Field(() => [String], { nullable: true })
  appendixes!: string[]

  @Field({ nullable: true })
  comments?: string

  @Field(() => [String], { nullable: true })
  ministry!: string[]

  @Field(() => [String], { name: 'lawChapters', nullable: true })
  law_chapters!: string[]

  @Field(() => [String], { nullable: true })
  impacts!: string[]

  @Field({ nullable: true })
  name?: string

  @Field({ name: 'idealPublishDate', nullable: true })
  ideal_publish_date?: string

  @Field({ nullable: true })
  ministry_id?: string

  @Field({ nullable: true })
  signature_date?: string

  @Field({ nullable: true })
  effective_date?: string

  @Field({ nullable: true })
  type?: string

  // Skoða types-api.ts (Regulation draft)
}
