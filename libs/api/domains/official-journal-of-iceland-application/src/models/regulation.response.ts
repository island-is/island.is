import { Field, Int, ObjectType } from '@nestjs/graphql'

// ---- Shared building-block types ----

@ObjectType('OJOIALawChapter')
export class OJOIALawChapter {
  @Field()
  name!: string

  @Field()
  slug!: string
}

@ObjectType('OJOIAMinistryListItem')
export class OJOIAMinistryListItem {
  @Field()
  name!: string

  @Field()
  slug!: string

  @Field(() => Int, { nullable: true })
  order?: number | null
}

@ObjectType('OJOIAAppendix')
export class OJOIAAppendix {
  @Field()
  title!: string

  @Field()
  text!: string
}

@ObjectType('OJOIARegulationOption')
export class OJOIARegulationOption {
  @Field()
  name!: string

  @Field()
  title!: string

  @Field()
  type!: string

  @Field()
  migrated!: boolean

  @Field({ nullable: true })
  repealed?: boolean

  @Field(() => [OJOIALawChapter], { nullable: true })
  lawChapters?: OJOIALawChapter[]
}

// ---- Response types ----

@ObjectType('OJOIALawChaptersResponse')
export class OJOIALawChaptersResponse {
  @Field(() => [OJOIALawChapter])
  lawChapters!: OJOIALawChapter[]
}

@ObjectType('OJOIAMinistriesResponse')
export class OJOIAMinistriesResponse {
  @Field(() => [OJOIAMinistryListItem])
  ministries!: OJOIAMinistryListItem[]
}

@ObjectType('OJOIARegulationOptionSearchResponse')
export class OJOIARegulationOptionSearchResponse {
  @Field(() => [OJOIARegulationOption])
  regulations!: OJOIARegulationOption[]
}

@ObjectType('OJOIACreateDraftResponse')
export class OJOIACreateDraftResponse {
  @Field()
  id!: string
}

// ---- Draft Impact response types ----

@ObjectType('OJOIADraftRegulationChange')
export class OJOIADraftRegulationChange {
  @Field()
  id!: string

  @Field({ nullable: true })
  changingId?: string

  @Field()
  type!: string // 'amend'

  @Field()
  name!: string

  @Field()
  regTitle!: string

  @Field({ nullable: true })
  date?: string

  @Field()
  title!: string

  @Field({ nullable: true })
  dropped?: boolean

  @Field({ nullable: true })
  diff?: string

  @Field()
  text!: string

  @Field(() => [OJOIAAppendix])
  appendixes!: OJOIAAppendix[]

  @Field()
  comments!: string
}

@ObjectType('OJOIADraftRegulationCancel')
export class OJOIADraftRegulationCancel {
  @Field()
  id!: string

  @Field({ nullable: true })
  changingId?: string

  @Field()
  type!: string // 'repeal'

  @Field()
  name!: string

  @Field()
  regTitle!: string

  @Field({ nullable: true })
  date?: string

  @Field({ nullable: true })
  dropped?: boolean
}

@ObjectType('OJOIADraftImpactsResponse')
export class OJOIADraftImpactsResponse {
  @Field(() => [OJOIADraftRegulationChange])
  changes!: OJOIADraftRegulationChange[]

  @Field(() => [OJOIADraftRegulationCancel])
  cancellations!: OJOIADraftRegulationCancel[]
}
