import { Field, ObjectType } from '@nestjs/graphql'
import { Document } from '@contentful/rich-text-types'
import graphqlTypeJson from 'graphql-type-json'
import { CacheField } from '@island.is/nest/graphql'

type Html = { __typename: string; document?: Document }

@ObjectType()
class VacancyLocation {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  postalCode?: number
}

@ObjectType()
class VacancyListItemBase {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  fieldOfWork?: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  applicationDeadlineFrom?: string

  @Field({ nullable: true })
  applicationDeadlineTo?: string

  @Field({ nullable: true })
  institutionName?: string

  @Field({ nullable: true })
  institutionReferenceIdentifier?: string

  @CacheField(() => [VacancyLocation], {
    nullable: true,
  })
  locations?: VacancyLocation[]

  @Field({ nullable: true })
  logoUrl?: string
}

@ObjectType()
export class VacancyListItem extends VacancyListItemBase {
  @Field({ nullable: true })
  intro?: string
}

@ObjectType()
export class VacancyContact {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  phone?: string
}

@ObjectType()
export class Vacancy extends VacancyListItemBase {
  @Field({ nullable: true })
  jobPercentage?: string

  @CacheField(() => [VacancyContact], {
    nullable: true,
  })
  contacts?: VacancyContact[]

  @Field({ nullable: true })
  applicationHref?: string

  @CacheField(() => graphqlTypeJson, { nullable: true })
  intro?: Html | null

  @CacheField(() => graphqlTypeJson, { nullable: true })
  qualificationRequirements?: Html | null

  @CacheField(() => graphqlTypeJson, { nullable: true })
  tasksAndResponsibilities?: Html | null

  @CacheField(() => graphqlTypeJson, { nullable: true })
  description?: Html | null

  @CacheField(() => graphqlTypeJson, { nullable: true })
  salaryTerms?: Html | null

  @Field({ nullable: true })
  plainTextIntro?: string
}
