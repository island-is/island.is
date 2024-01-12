import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CaseCategoryType } from './caseCategory.type'
import { CaseDepartmentType } from './caseDepartment.type'
import { CaseSignatureType } from './caseSignature.type'
import { CaseSubCategoryType } from './caseSubCategory.type'
import { CaseTemplateType } from './caseTemplate.type'

@ObjectType('MinistryOfJusticeCase')
export class Case {
  @Field(() => ID, { nullable: true })
  applicationId?: string

  @Field(() => CaseDepartmentType, { nullable: true })
  department?: CaseDepartmentType

  @Field(() => CaseCategoryType, { nullable: true })
  category?: CaseCategoryType

  @Field(() => CaseSubCategoryType, { nullable: true })
  subCategory?: CaseSubCategoryType

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => CaseTemplateType, { nullable: true })
  template?: CaseTemplateType

  @Field(() => String, { nullable: true })
  documentContents?: string

  @Field(() => CaseSignatureType, { nullable: true })
  signatureType?: CaseSignatureType

  @Field(() => String, { nullable: true })
  signatureContents?: string

  @Field(() => String, { nullable: true })
  signatureDate?: string

  @Field(() => String, { nullable: true })
  ministry?: string

  @Field(() => String, { nullable: true })
  preferedPublicationDate?: string

  @Field(() => Boolean, { nullable: true })
  fastTrack?: boolean
}
