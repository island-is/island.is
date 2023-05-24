import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class IcelandicGovernmentInstitutionVacancyLocation {
  @Field({ nullable: true })
  postalCode?: number

  @Field({ nullable: true })
  title?: string
}

@ObjectType()
export class IcelandicGovernmentInstitutionVacancyListItem {
  @Field({ nullable: true })
  id?: number

  @Field({ nullable: true })
  fieldOfWork?: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  applicationDeadlineFrom?: string

  @Field({ nullable: true })
  applicationDeadlineTo?: string

  @Field({ nullable: true })
  institutionName?: string

  @Field(() => IcelandicGovernmentInstitutionVacancyLocation, {
    nullable: true,
  })
  locations?: IcelandicGovernmentInstitutionVacancyLocation

  @Field({ nullable: true })
  logoUrl?: string
}

@ObjectType()
class IcelandicGovernmentInstitutionVacancyContact {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  email?: string
}

@ObjectType()
export class IcelandicGovernmentInstitutionVacancy extends IcelandicGovernmentInstitutionVacancyListItem {
  @Field({ nullable: true })
  postalAddress?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  jobPercentage?: string

  @Field(() => IcelandicGovernmentInstitutionVacancyContact, {
    nullable: true,
  })
  contacts?: IcelandicGovernmentInstitutionVacancyContact
}
