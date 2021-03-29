import { Field, ObjectType } from '@nestjs/graphql'
import { LawChapterModel } from './lawChapter'
import { MinistryModel } from './ministry'

@ObjectType()
class RegulationHistoryItemModel {
  @Field(() => Date, { nullable: true })
  date!: string
  @Field()
  name!: string
  @Field()
  title!: string
  @Field()
  effect!: 'amend' | 'repeal'
}

@ObjectType()
class RegulationEffectModel {
  @Field(() => Date, { nullable: true })
  date!: string
  @Field()
  name!: string
  @Field()
  title!: string
  @Field()
  effect!: string
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
  from!: string
  @Field(() => Date, { nullable: true })
  to!: string
}

@ObjectType()
export class RegulationModel {
  @Field()
  type!: string
  @Field()
  name!: string
  @Field()
  title!: string
  @Field()
  text!: string
  @Field(() => Date, { nullable: true })
  publishedDate!: string
  @Field(() => Date, { nullable: true })
  signatureDate!: string
  @Field(() => Date, { nullable: true })
  effectiveDate!: string
  @Field((type) => [RegulationAppendix])
  appendixes!: Array<RegulationAppendix>
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
  timelineDate?: string
  @Field((type) => ShowingDiffModel, { nullable: true })
  showingDiff?: ShowingDiffModel
}
