import { Field, ObjectType } from '@nestjs/graphql'
import { Document } from '@contentful/rich-text-types'
import graphqlTypeJson from 'graphql-type-json'

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

  @Field(() => [IcelandicGovernmentInstitutionVacancyLocation], {
    nullable: true,
  })
  locations?: IcelandicGovernmentInstitutionVacancyLocation[]

  @Field({ nullable: true })
  logoUrl?: string
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
}

@ObjectType()
export class IcelandicGovernmentInstitutionVacancy extends IcelandicGovernmentInstitutionVacancyListItemBase {
  @Field({ nullable: true })
  jobPercentage?: string

  @Field(() => [IcelandicGovernmentInstitutionVacancyContact], {
    nullable: true,
  })
  contacts?: IcelandicGovernmentInstitutionVacancyContact[]

  @Field({ nullable: true })
  applicationHref?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  intro?: Html | null

  @Field(() => graphqlTypeJson, { nullable: true })
  qualificationRequirements?: Html | null

  @Field(() => graphqlTypeJson, { nullable: true })
  tasksAndResponsibilities?: Html | null

  @Field(() => graphqlTypeJson, { nullable: true })
  description?: Html | null

  @Field(() => graphqlTypeJson, { nullable: true })
  salaryTerms?: Html | null

  @Field({ nullable: true })
  plainTextIntro?: string
}
