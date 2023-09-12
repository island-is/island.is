import { ObjectType } from '@nestjs/graphql'
import {
  DegreeType,
  // FieldType,
  ModeOfDelivery,
  Requirement,
  Season,
} from '@island.is/university-gateway-types'

export
@ObjectType('Program')
class Program {
  id!: string
  externalId!: string
  active!: boolean
  nameIs!: string
  nameEn!: string
  universityId!: string
  departmentNameIs!: string
  departmentNameEn!: string
  startingSemesterYear!: number
  startingSemesterSeason!: Season
  applicationStartDate!: Date
  applicationEndDate!: Date
  degreeType!: DegreeType
  degreeAbbreviation!: string
  credits!: number
  descriptionIs!: string
  descriptionEn!: string
  durationInYears!: number
  costPerYear?: number
  iscedCode!: string
  searchKeywords!: string[]
  tag!: ProgramTag[]
  modeOfDelivery!: ModeOfDelivery[]
}

export
@ObjectType('ProgramDetails')
class ProgramDetails extends Program {
  externalUrlIs?: string
  externalUrlEn?: string
  admissionRequirementsIs?: string
  admissionRequirementsEn?: string
  studyRequirementsIs?: string
  studyRequirementsEn?: string
  costInformationIs?: string
  costInformationEn?: string
  courses!: ProgramCourse[]
  // extraApplicationField!: ProgramExtraApplicationField[]
}

@ObjectType('ProgramCourse')
class ProgramCourse {
  id!: string
  externalId!: string
  nameIs!: string
  nameEn!: string
  credits!: number
  semesterYear?: number
  semesterSeason!: Season
  descriptionIs?: string
  descriptionEn?: string
  externalUrlIs?: string
  externalUrlEn?: string
  requirement!: Requirement
}

@ObjectType('ProgramTag')
class ProgramTag {
  id!: string
  code!: string
  nameIs!: string
  nameEn!: string
}

// @ObjectType('ProgramExtraApplicationField')
// class ProgramExtraApplicationField {
//   nameIs!: string
//   nameEn?: string
//   descriptionIs?: string
//   descriptionEn?: string
//   required!: boolean
//   fieldType!: FieldType
//   uploadAcceptedFileType?: string
// }
