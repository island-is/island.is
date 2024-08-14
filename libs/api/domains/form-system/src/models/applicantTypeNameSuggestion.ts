import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { ApplicantTypeNameSuggestionApplicantTypeEnum } from '@island.is/clients/form-system'
import { LanguageType } from './LanguageType.model'

registerEnumType(ApplicantTypeNameSuggestionApplicantTypeEnum, {
  name: 'FormSystemApplicantTypeNameSuggestionApplicantTypeEnum'
})

@ObjectType('FormSystemApplicantTypeNameSuggestion')
export class ApplicantTypeNameSuggestion {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => Date, { nullable: true })
  modified?: Date

  @Field(() => LanguageType, { nullable: true })
  nameSuggestion?: LanguageType

  @Field(() => ApplicantTypeNameSuggestionApplicantTypeEnum, { nullable: true })
  applicantType?: ApplicantTypeNameSuggestionApplicantTypeEnum
}
