import { ISODate, RegName } from '@island.is/clients/regulations'
import { Field, ObjectType } from '@nestjs/graphql'
import { LawChapterModel } from './lawChapter'
import { MinistryModel } from './ministry'

@ObjectType()
class RegulationHistoryItemModel {
  @Field(() => Date, { nullable: true })
  date!: string // ISODate
  @Field()
  name!: string // RegName
  @Field()
  title!: string
  @Field()
  effect!: 'amend' | 'repeal'
}

@ObjectType()
class RegulationEffectModel {
  @Field(() => Date, { nullable: true })
  date!: string // ISODate
  @Field()
  name!: string // RegName
  @Field()
  title!: string
  @Field()
  effect!: 'amend' | 'repeal'
}

@ObjectType()
class RegulationAppendix {
  @Field()
  title!: string
  @Field()
  text!: string
}

@ObjectType()
class ShowingDiffModel {
  @Field(() => Date, { nullable: true })
  from!: string // ISODate
  @Field(() => Date, { nullable: true })
  to!: string // ISODate
}

@ObjectType()
export class RegulationModel {
  @Field()
  type!: 'base' | 'amend'
  @Field()
  name!: string // RegName
  @Field()
  title!: string
  @Field()
  text!: string
  @Field(() => Date, { nullable: true })
  publishedDate!: string // ISODate
  @Field(() => Date, { nullable: true })
  signatureDate!: string // ISODate
  @Field(() => Date, { nullable: true })
  effectiveDate!: string // ISODate
  @Field((type) => [RegulationAppendix])
  appendixes!: Array<RegulationAppendix>
  @Field({ nullable: true })
  comments!: string
  @Field(() => Date, { nullable: true })
  lastAmendDate!: string
  @Field(() => Date, { nullable: true })
  repealedDate?: string
  @Field((type) => MinistryModel)
  ministry!: MinistryModel
  @Field((type) => [LawChapterModel])
  lawChapters!: Array<LawChapterModel>
  @Field((type) => [RegulationHistoryItemModel])
  history!: Array<RegulationHistoryItemModel>
  @Field((type) => [RegulationEffectModel])
  effects?: Array<RegulationEffectModel>
  @Field(() => Date, { nullable: true })
  timelineDate?: string // ISODate
  @Field((type) => ShowingDiffModel, { nullable: true })
  showingDiff?: ShowingDiffModel
}
