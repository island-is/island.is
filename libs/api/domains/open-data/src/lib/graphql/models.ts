import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('OpenDataResource')
export class OpenDataResource {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field()
  format!: string

  @Field()
  url!: string

  @Field({ nullable: true })
  size?: number

  @Field({ nullable: true })
  lastModified?: string

  @Field({ nullable: true })
  license?: string
}

@ObjectType('OpenDataDatasetMetadata')
export class OpenDataDatasetMetadata {
  @Field({ nullable: true })
  size?: string

  @Field({ nullable: true })
  recordCount?: number

  @Field({ nullable: true })
  updateFrequency?: string
}

@ObjectType('OpenDataDataset')
export class OpenDataDataset {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  description!: string

  @Field()
  category!: string

  @Field()
  publisher!: string

  @Field()
  publisherId!: string

  @Field({ nullable: true })
  organizationImage?: string

  @Field()
  lastUpdated!: string

  @Field()
  format!: string

  @Field(() => [String])
  tags!: string[]

  @Field({ nullable: true })
  downloadUrl?: string

  @Field(() => OpenDataDatasetMetadata, { nullable: true })
  metadata?: OpenDataDatasetMetadata

  @Field(() => [OpenDataResource], { nullable: true })
  resources?: OpenDataResource[]

  @Field({ nullable: true })
  license?: string

  @Field({ nullable: true })
  maintainer?: string

  @Field({ nullable: true })
  maintainerEmail?: string

  @Field({ nullable: true })
  author?: string

  @Field({ nullable: true })
  authorEmail?: string
}

@ObjectType('OpenDataDatasetsResponse')
export class OpenDataDatasetsResponse {
  @Field(() => [OpenDataDataset])
  datasets!: OpenDataDataset[]

  @Field()
  total!: number

  @Field()
  page!: number

  @Field()
  limit!: number

  @Field()
  hasMore!: boolean
}

@ObjectType('OpenDataFilterOption')
export class OpenDataFilterOption {
  @Field()
  value!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  count?: number
}

@ObjectType('OpenDataFilter')
export class OpenDataFilter {
  @Field(() => ID)
  id!: string

  @Field()
  field!: string

  @Field()
  label!: string

  @Field(() => [OpenDataFilterOption])
  options!: OpenDataFilterOption[]
}

@ObjectType('OpenDataPublisher')
export class OpenDataPublisher {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  website?: string
}
