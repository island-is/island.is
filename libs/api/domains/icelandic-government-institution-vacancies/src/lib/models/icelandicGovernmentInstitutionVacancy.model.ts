import { Field, ObjectType } from '@nestjs/graphql'
import { Document } from '@contentful/rich-text-types'
import graphqlTypeJson from 'graphql-type-json'
import { CacheField } from '@island.is/nest/graphql'

type Html = { __typename: string; document?: Document }

@ObjectType()
class IcelandicGovernmentInstitutionVacancyLocation {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  postalCode?: number
}

@ObjectType()
class IcelandicGovernmentInstitutionVacancyListItemBase {
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

  @CacheField(() => [IcelandicGovernmentInstitutionVacancyLocation], {
    nullable: true,
  })
  locations?: IcelandicGovernmentInstitutionVacancyLocation[]

  @Field({ nullable: true })
  logoUrl?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  creationDate?: string

  @Field({ nullable: true })
  updatedDate?: string
}

@ObjectType()
export class IcelandicGovernmentInstitutionVacancyListItem extends IcelandicGovernmentInstitutionVacancyListItemBase {
  @Field({ nullable: true })
  intro?: string
}

@ObjectType()
export class IcelandicGovernmentInstitutionVacancyContact {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  jobTitle?: string
}

@ObjectType()
export class IcelandicGovernmentInstitutionVacancy extends IcelandicGovernmentInstitutionVacancyListItemBase {
  @Field({ nullable: true })
  jobPercentage?: string

  @CacheField(() => [IcelandicGovernmentInstitutionVacancyContact], {
    nullable: true,
  })
  contacts?: IcelandicGovernmentInstitutionVacancyContact[]

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
