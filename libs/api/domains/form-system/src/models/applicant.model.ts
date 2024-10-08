import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { FormApplicantDtoApplicantTypeEnum } from '@island.is/clients/form-system'
import { LanguageType } from './languageType.model'

registerEnumType(FormApplicantDtoApplicantTypeEnum, {
  name: 'FormSystemApplicantTypeEnum',
})

@ObjectType('FormSystemApplicant')
export class Applicant {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => FormApplicantDtoApplicantTypeEnum, { nullable: true })
  applicantType?: FormApplicantDtoApplicantTypeEnum

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType
}
