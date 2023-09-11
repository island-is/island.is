import { ObjectType } from '@nestjs/graphql'
import {
  Course as ICourse,
  CourseSemesterSeasonEnum,
  Program as IProgram,
  ProgramCourse as IProgramCourse,
  ProgramCourseRequirementEnum,
  ProgramDetails as IProgramDetails,
  ProgramExtraApplicationField as IProgramExtraApplicationField,
  ProgramModeOfDelivery as IProgramModeOfDelivery,
  ProgramTag as IProgramTag,
  Tag as ITag,
  ProgramModeOfDeliveryModeOfDeliveryEnum,
  ProgramExtraApplicationFieldFieldTypeEnum,
} from '@island.is/clients/university-gateway-api'
import { DegreeType, Season } from '@island.is/university-gateway-types'

export
@ObjectType('Program')
class Program /*implements IProgram*/ {
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
  modeOfDelivery!: ProgramModeOfDelivery[]
}

export
@ObjectType('ProgramDetails')
class ProgramDetails extends Program /*implements IProgramDetails*/ {
  externalUrlIs?: string
  externalUrlEn?: string
  admissionRequirementsIs?: string
  admissionRequirementsEn?: string
  studyRequirementsIs?: string
  studyRequirementsEn?: string
  costInformationIs?: string
  costInformationEn?: string
  courses!: ProgramCourse[]
  extraApplicationField!: ProgramExtraApplicationField[]
}

@ObjectType('ProgramCourse')
class ProgramCourse implements IProgramCourse {
  details!: Course
  requirement!: ProgramCourseRequirementEnum
}

@ObjectType('Course')
class Course implements ICourse {
  id!: string
  externalId!: string
  nameIs!: string
  nameEn!: string
  universityId!: string
  credits!: number
  semesterYear?: number
  semesterSeason!: CourseSemesterSeasonEnum
  descriptionIs?: string
  descriptionEn?: string
  externalUrlIs?: string
  externalUrlEn?: string
}

@ObjectType('ProgramTag')
class ProgramTag implements IProgramTag {
  tagId!: string
  details!: Tag
}

@ObjectType('Tag')
class Tag implements ITag {
  code!: string
  nameIs!: string
  nameEn!: string
}

@ObjectType('ProgramModeOfDelivery')
class ProgramModeOfDelivery implements IProgramModeOfDelivery {
  modeOfDelivery!: ProgramModeOfDeliveryModeOfDeliveryEnum
}

class ProgramExtraApplicationField implements IProgramExtraApplicationField {
  nameIs!: string
  nameEn?: string
  descriptionIs?: string
  descriptionEn?: string
  required!: boolean
  fieldType!: ProgramExtraApplicationFieldFieldTypeEnum
  uploadAcceptedFileType?: string
}
