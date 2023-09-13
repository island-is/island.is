import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import {
  DegreeType,
  // FieldType,
  ModeOfDelivery,
  Requirement,
  Season,
} from '@island.is/university-gateway-types'

registerEnumType(DegreeType, { name: 'DegreeType' })
// registerEnumType(FieldType, { name: 'FieldType' })
registerEnumType(ModeOfDelivery, { name: 'ModeOfDelivery' })
registerEnumType(Requirement, { name: 'Requirement' })
registerEnumType(Season, { name: 'Season' })

export
@ObjectType('Program')
class Program {
  @Field()
  id!: string

  @Field()
  externalId!: string

  @Field()
  active!: boolean

  @Field()
  nameIs!: string

  @Field()
  nameEn!: string

  @Field()
  universityId!: string

  @Field()
  departmentNameIs!: string

  @Field()
  departmentNameEn!: string

  @Field()
  startingSemesterYear!: number

  @Field(() => Season)
  startingSemesterSeason!: Season

  @Field()
  applicationStartDate!: Date

  @Field()
  applicationEndDate!: Date

  @Field(() => DegreeType)
  degreeType!: DegreeType

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
  searchKeywords!: string[]

  @Field(() => [ProgramTag])
  tag!: ProgramTag[]

  @Field(() => [ModeOfDelivery])
  modeOfDelivery!: ModeOfDelivery[]
}

export
@ObjectType('ProgramDetails')
class ProgramDetails extends Program {
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

  @Field(() => [ProgramCourse])
  courses!: ProgramCourse[]

  // @Field(() => [ProgramExtraApplicationField])
  // extraApplicationField!: ProgramExtraApplicationField[]
}

@ObjectType('ProgramCourse')
class ProgramCourse {
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

  @Field(() => Season)
  semesterSeason!: Season

  @Field({ nullable: true })
  descriptionIs?: string

  @Field({ nullable: true })
  descriptionEn?: string

  @Field({ nullable: true })
  externalUrlIs?: string

  @Field({ nullable: true })
  externalUrlEn?: string

  @Field(() => Requirement)
  requirement!: Requirement
}

@ObjectType('ProgramTag')
class ProgramTag {
  @Field()
  id!: string

  @Field()
  code!: string

  @Field()
  nameIs!: string

  @Field()
  nameEn!: string
}

// @ObjectType('ProgramExtraApplicationField')
// class ProgramExtraApplicationField {
//   @Field()
//   nameIs!: string

//   @Field({ nullable: true })
//   nameEn?: string

//   @Field({ nullable: true })
//   descriptionIs?: string

//   @Field({ nullable: true })
//   descriptionEn?: string

//   @Field()
//   required!: boolean

//   @Field(() => FieldType)
//   fieldType!: FieldType

//   @Field({ nullable: true })
//   uploadAcceptedFileType?: string
// }
