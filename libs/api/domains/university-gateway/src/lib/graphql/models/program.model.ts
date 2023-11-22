import { Field, ObjectType } from '@nestjs/graphql'

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

  @Field()
  applicationStartDate!: Date

  @Field()
  applicationEndDate!: Date

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

  @Field(() => [String])
  modeOfDelivery!: string[]
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

  @Field(() => [UniversityGatewayProgramCourse])
  courses!: UniversityGatewayProgramCourse[]

  // @Field(() => [UniversityGatewayProgramExtraApplicationField])
  // extraApplicationFields!: UniversityGatewayProgramExtraApplicationField[]
}

@ObjectType('UniversityGatewayProgramCourse')
class UniversityGatewayProgramCourse {
  @Field()
  id!: string

  @Field()
  externalId!: string

  @Field()
  nameIs!: string

  @Field()
  nameEn!: string

  @Field()
  credits!: number

  @Field({ nullable: true })
  semesterYear?: number

  @Field({ nullable: true })
  semesterYearNumber?: number

  @Field()
  semesterSeason!: string

  @Field({ nullable: true })
  descriptionIs?: string

  @Field({ nullable: true })
  descriptionEn?: string

  @Field({ nullable: true })
  externalUrlIs?: string

  @Field({ nullable: true })
  externalUrlEn?: string

  @Field()
  requirement!: string
}

// @ObjectType('UniversityGatewayProgramExtraApplicationField')
// class UniversityGatewayProgramExtraApplicationField {
//   @Field()
//   externalId!: string

//   @Field()
//   nameIs!: string

//   @Field()
//   nameEn!: string

//   @Field({ nullable: true })
//   descriptionIs?: string

//   @Field({ nullable: true })
//   descriptionEn?: string

//   @Field()
//   required!: boolean

//   @Field()
//   fieldType!: string

//   @Field({ nullable: true })
//   uploadAcceptedFileType?: string
// }
