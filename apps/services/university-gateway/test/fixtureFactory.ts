import { getModelToken } from '@nestjs/sequelize'
import faker from 'faker'
import { InferCreationAttributes, Model } from 'sequelize'

import { createNationalId } from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { Program } from '../src/app/modules/program/model/program'
import { University } from '../src/app/modules/university/model/university'
import {
  CourseSeason,
  DegreeType,
  ModeOfDelivery,
  Requirement,
  Season,
} from '@island.is/university-gateway'
import { Course } from '../src/app/modules/course/model/course'
import { ProgramCourse } from '../src/app/modules/program/model/programCourse'

type CreateProgram = Partial<InferCreationAttributes<Program>> &
  Pick<Program, 'universityId' | 'durationInYears'>

type CreateProgramCourse = Partial<InferCreationAttributes<ProgramCourse>> &
  Pick<ProgramCourse, 'programId'>

export class FixtureFactory {
  constructor(private app: TestApp) {}

  get<T extends new () => Model>(model: T): T {
    return this.app.get(getModelToken(model))
  }

  async createUniversity() {
    return this.get(University).create({
      nationalId: createNationalId('company'),
      contentfulKey: faker.random.word(),
    })
  }

  async createProgram({ universityId, durationInYears }: CreateProgram) {
    return this.get(Program).create({
      externalId: faker.datatype.uuid(),
      nameIs: faker.random.word(),
      nameEn: faker.random.word(),
      specializationExternalId: faker.datatype.uuid(),
      universityId: universityId,
      departmentNameIs: faker.random.word(),
      departmentNameEn: faker.random.word(),
      startingSemesterYear: 2023,
      startingSemesterSeason: Season.FALL,
      applicationStartDate: new Date(),
      applicationEndDate: new Date(),
      degreeType: DegreeType.UNDERGRADUATE,
      degreeAbbreviation: faker.random.word(),
      credits: 180,
      descriptionIs: faker.random.words(),
      descriptionEn: faker.random.words(),
      durationInYears: durationInYears,
      iscedCode: faker.random.word(),
      modeOfDelivery: [ModeOfDelivery.ON_SITE],
      active: true,
      tmpActive: false,
      allowException: false,
      allowThirdLevelQualification: false,
    })
  }

  async createCourse({ programId }: CreateProgramCourse) {
    const program = await this.get(Program).findByPk(programId)

    const course = await this.get(Course).create({
      externalId: faker.datatype.uuid(),
      nameIs: faker.random.word(),
      nameEn: faker.random.word(),
      universityId: program?.universityId,
      credits: 6,
    })

    await this.get(ProgramCourse).create({
      programId: programId,
      courseId: course.id,
      requirement: Requirement.MANDATORY,
      semesterYear: 2023,
      semesterSeason: CourseSeason.FALL,
    })

    return course
  }
}
