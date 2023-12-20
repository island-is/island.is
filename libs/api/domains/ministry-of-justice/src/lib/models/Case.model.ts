import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CaseCategoryType } from './CaseCategory'
import { CaseDepartmentType } from './CaseDepartment.model'
import { CaseSignatureType } from './CaseSignatureType'
import { CaseSubCategoryType } from './CaseSubCategory'
import { CaseTemplateType } from './CaseTemplate.model'

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
