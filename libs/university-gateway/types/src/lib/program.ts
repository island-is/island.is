export enum ModeOfDelivery {
  ON_SITE = 'ON_SITE',
  ONLINE = 'ONLINE',
  ONLINE_WITH_SESSION = 'ONLINE_WITH_SESSION',
}

import { Season } from './season'
import { DegreeType } from './degreeType'
import { ProgramExtraApplicationField } from './programExtraApplicationField'
import { ProgramTag } from './programTag'
import { ProgramModeOfDelivery } from './programModeOfDelivery'
import { ProgramCourse } from './programCourse'

export type Program = {
  id: string
  externalId: string
  active: boolean
  nameIs: string
  nameEn: string
  universityId: string
  departmentNameIs: string
  departmentNameEn: string
  startingSemesterYear: number
  startingSemesterSeason: Season
  applicationStartDate: Date
  applicationEndDate: Date
  degreeType: DegreeType
  degreeAbbreviation: string
  credits: number
  descriptionIs: string
  descriptionEn: string
  durationInYears: number
  costPerYear: number
  iscedCode: string
  //searchKeywords: string[]
  externalUrlIs: string
  externalUrlEn: string
  admissionRequirementsIs: string
  admissionRequirementsEn: string
  studyRequirementsIs: string
  studyRequirementsEn: string
  costInformationIs: string
  costInformationEn: string
  //courses: ProgramCourse[]
  //tag: [ProgramTag]
  //modeOfDelivery: [ProgramModeOfDelivery]
  //extraApplicationField: [ProgramExtraApplicationField]
  created: Date
  modified: Date
}
