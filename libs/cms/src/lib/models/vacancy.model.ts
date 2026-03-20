import { Field, ID, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { CacheField } from '@island.is/nest/graphql'
import { IVacancy } from '../generated/contentfulTypes'
import { Organization, mapOrganization } from './organization.model'
import { Html, mapHtml } from './html.model'

@ObjectType()
export class Vacancy {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  applicationDeadlineFrom?: string

  @Field({ nullable: true })
  applicationDeadlineTo?: string

  @Field({ nullable: true })
  fieldOfWork?: string

  @CacheField(() => Organization, { nullable: true })
  organization?: Organization | null

  @Field(() => [String], { nullable: true })
  locations?: string[]

  @Field({ nullable: true })
  jobPercentage?: string

  @Field({ nullable: true })
  applicationHref?: string

  @CacheField(() => Html, { nullable: true })
  intro?: Html | null

  @CacheField(() => Html, { nullable: true })
  qualificationRequirements?: Html | null

  @CacheField(() => Html, { nullable: true })
  tasksAndResponsibilities?: Html | null

  @CacheField(() => Html, { nullable: true })
  description?: Html | null

  @CacheField(() => Html, { nullable: true })
  salaryTerms?: Html | null

  @CacheField(() => GraphQLJSON, { nullable: true })
  contacts?: { email?: string; name?: string; phone?: string }[] | null

  @Field({ nullable: true })
  createdAt?: string

  @Field({ nullable: true })
  updatedAt?: string
}

export const mapVacancy = ({ fields, sys }: IVacancy): Vacancy => ({
  id: sys.id,
  title: fields.title,
  applicationDeadlineFrom: fields.applicationDeadlineFrom,
  applicationDeadlineTo: fields.applicationDeadlineTo,
  applicationHref: fields.applicationHref,
  fieldOfWork: fields.fieldOfWork,
  jobPercentage: fields.jobPercentage,
  locations: fields.locations,
  organization:
    (fields.organization && mapOrganization(fields.organization)) ?? null,
  intro: (fields.intro && mapHtml(fields.intro, `${sys.id}:intro`)) ?? null,
  description:
    (fields.description &&
      mapHtml(fields.description, `${sys.id}:description`)) ??
    null,
  qualificationRequirements:
    (fields.qualificationRequirements &&
      mapHtml(
        fields.qualificationRequirements,
        `${sys.id}:qualificationRequirements`,
      )) ??
    null,
  salaryTerms:
    (fields.salaryTerms &&
      mapHtml(fields.salaryTerms, `${sys.id}:salaryTerms`)) ??
    null,
  tasksAndResponsibilities:
    (fields.tasksAndResponsibilities &&
      mapHtml(
        fields.tasksAndResponsibilities,
        `${sys.id}:tasksAndResponsibilities`,
      )) ??
    null,
  contacts: (fields.contacts as Vacancy['contacts']) ?? [],
  createdAt: sys.createdAt,
  updatedAt: sys.updatedAt,
})
