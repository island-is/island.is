import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SecondarySchoolSubjectStructure')
export class SecondarySchoolSubjectStructure {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => Int, { nullable: true })
  level1?: number

  @Field(() => Int, { nullable: true })
  level2?: number

  @Field(() => Int, { nullable: true })
  level3?: number

  @Field(() => Int, { nullable: true })
  level4?: number

  @Field(() => Int, { nullable: true })
  credits?: number
}

@ObjectType('SecondarySchoolPackage')
export class SecondarySchoolPackage {
  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => [SecondarySchoolSubjectStructure], { nullable: true })
  subjects?: SecondarySchoolSubjectStructure[] | null
}

@ObjectType('SecondarySchoolCoreSubjectGroup')
export class SecondarySchoolCoreSubjectGroup {
  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => [SecondarySchoolSubjectStructure], { nullable: true })
  subjects?: SecondarySchoolSubjectStructure[] | null
}

@ObjectType('SecondarySchoolPackageChoice')
export class SecondarySchoolPackageChoice {
  @Field(() => Int, { nullable: true })
  requiredPackages?: number

  @Field(() => [SecondarySchoolPackage], { nullable: true })
  packages?: SecondarySchoolPackage[] | null
}

@ObjectType('SecondarySchoolSubjectChoiceGroup')
export class SecondarySchoolSubjectChoiceGroup {
  @Field(() => Int, { nullable: true })
  requiredCredits?: number

  @Field(() => [SecondarySchoolSubjectStructure], { nullable: true })
  subjects?: SecondarySchoolSubjectStructure[] | null
}

@ObjectType('SecondarySchoolProgrammeStructure')
export class SecondarySchoolProgrammeStructure {
  @Field(() => [SecondarySchoolCoreSubjectGroup], { nullable: true })
  coreSubjectGroups?: SecondarySchoolCoreSubjectGroup[] | null

  @Field(() => [SecondarySchoolPackageChoice], { nullable: true })
  packageChoices?: SecondarySchoolPackageChoice[] | null

  @Field(() => [SecondarySchoolSubjectChoiceGroup], { nullable: true })
  subjectChoiceGroups?: SecondarySchoolSubjectChoiceGroup[] | null
}
