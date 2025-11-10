import { CacheField } from '@island.is/nest/graphql'
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { Document } from '@contentful/rich-text-types'
import graphqlTypeJson from 'graphql-type-json'

export type Html = { __typename: string; document?: Document }

@ObjectType('UniversityGatewayProgram')
export class UniversityGatewayProgram {
  @Field()
  active!: boolean

  @Field()
  id!: string

  @Field()
  externalId!: string

  @Field()
  nameIs!: string

  @Field()
  nameEn!: string

  @Field({ nullable: true })
  specializationExternalId?: string

  @Field({ nullable: true })
  specializationNameIs?: string

  @Field({ nullable: true })
  specializationNameEn?: string

  @Field()
  universityId!: string

  @Field()
  universityContentfulKey!: string

  @Field()
  departmentNameIs!: string

  @Field()
  departmentNameEn!: string

  @Field()
  startingSemesterYear!: number

  @Field()
  startingSemesterSeason!: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  declare applicationStartDate: Date | null

  @Field(() => GraphQLISODateTime, { nullable: true })
  declare applicationEndDate: Date | null

  @Field({ nullable: true })
  schoolAnswerDate?: Date

  @Field({ nullable: true })
  studentAnswerDate?: Date

  @Field()
  degreeType!: string

  @Field()
  degreeAbbreviation!: string

  @Field()
  credits!: number

  @Field()
  descriptionIs!: string

  @Field()
  descriptionEn!: string

  @Field()
  durationInYears!: number

  @Field({ nullable: true })
  costPerYear?: number

  @Field()
  iscedCode!: string

  @CacheField(() => [String])
  modeOfDelivery!: string[]

  @Field()
  applicationPeriodOpen!: boolean

  @Field()
  applicationInUniversityGateway!: boolean
}

@ObjectType('UniversityGatewayProgramDetails')
export class UniversityGatewayProgramDetails extends UniversityGatewayProgram {
  @Field({ nullable: true })
  externalUrlIs?: string

  @Field({ nullable: true })
  externalUrlEn?: string

  @Field({ nullable: true })
  admissionRequirementsIs?: string

  @Field({ nullable: true })
  admissionRequirementsEn?: string

  @Field({ nullable: true })
  studyRequirementsIs?: string

  @Field({ nullable: true })
  studyRequirementsEn?: string

  @Field({ nullable: true })
  costInformationIs?: string

  @Field({ nullable: true })
  costInformationEn?: string

  @Field({ nullable: true })
  arrangementIs?: string

  @Field({ nullable: true })
  arrangementEn?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  descriptionHtmlIs?: Html | null

  @Field(() => graphqlTypeJson, { nullable: true })
  descriptionHtmlEn?: Html | null

  @Field()
  allowException!: boolean

  @Field()
  allowThirdLevelQualification!: boolean

  @CacheField(() => [UniversityGatewayProgramExtraApplicationField])
  extraApplicationFields!: UniversityGatewayProgramExtraApplicationField[]
}

@ObjectType('UniversityGatewayProgramExtraApplicationField')
class UniversityGatewayProgramExtraApplicationField {
  @Field()
  externalKey!: string

  @Field()
  nameIs!: string

  @Field()
  nameEn!: string

  @Field({ nullable: true })
  descriptionIs?: string

  @Field({ nullable: true })
  descriptionEn?: string

  @Field()
  required!: boolean

  @Field()
  fieldType!: string

  @Field({ nullable: true })
  uploadAcceptedFileType?: string

  @Field({ nullable: true })
  options?: string
}
