import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import { Season, DegreeType } from '@island.is/university-gateway-types'
import { ProgramCourse } from './programCourse.model'
import { ProgramExtraApplicationField } from './programExtraApplicationField.model'
import { ProgramTag } from './programTag.model'
import { ProgramModeOfDelivery } from './programModeOfDelivery.model'
import type { Program as TProgram } from '@island.is/university-gateway-types'

registerEnumType(Season, { name: 'Season' })
registerEnumType(DegreeType, { name: 'DegreeType' })

@ObjectType()
export class Program implements TProgram {
  @Field(() => ID)
  readonly id!: string

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

  @Field()
  costPerYear!: number

  @Field()
  iscedCode!: string

  @Field(() => [String])
  searchKeywords!: string[]

  @Field()
  externalUrlIs!: string

  @Field()
  externalUrlEn!: string

  @Field()
  admissionRequirementsIs!: string

  @Field()
  admissionRequirementsEn!: string

  @Field()
  studyRequirementsIs!: string

  @Field()
  studyRequirementsEn!: string

  @Field()
  costInformationIs!: string

  @Field()
  costInformationEn!: string

  @Field(() => [ProgramCourse])
  courses!: ProgramCourse[]

  @Field(() => ProgramTag)
  tag!: ProgramTag

  @Field(() => ProgramModeOfDelivery)
  modeOfDelivery!: ProgramModeOfDelivery

  @Field(() => ProgramExtraApplicationField)
  extraApplicationField!: ProgramExtraApplicationField

  @Field()
  created!: Date

  @Field()
  modified!: Date
}
