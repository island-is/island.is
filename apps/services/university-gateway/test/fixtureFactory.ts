import { getModelToken } from '@nestjs/sequelize'
import { faker } from '@faker-js/faker'
import { Model } from 'sequelize'
import { createNationalId } from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'
import { Program } from '../src/app/modules/program/model/program'
import { University } from '../src/app/modules/university/model/university'
import {
  DegreeType,
  ModeOfDelivery,
  Season,
} from '@island.is/university-gateway'
import { ProgramModeOfDelivery } from '../src/app/modules/program/model/programModeOfDelivery'

export class FixtureFactory {
  constructor(private app: TestApp) {}

  get<T extends new () => Model>(model: T): T {
    return this.app.get(getModelToken(model))
  }

  async createUniversity() {
    return this.get(University).create({
      nationalId: createNationalId('company'),
      contentfulKey: faker.word.sample(),
    })
  }

  async createProgram({
    universityId,
    durationInYears,
    modeOfDeliveryList,
  }: {
    universityId: string
    durationInYears: number
    modeOfDeliveryList: ModeOfDelivery[]
  }) {
    const program = await this.get(Program).create({
      externalId: faker.string.uuid(),
      nameIs: faker.word.sample(),
      nameEn: faker.word.sample(),
      specializationExternalId: faker.string.uuid(),
      universityId: universityId,
      departmentNameIs: faker.word.sample(),
      departmentNameEn: faker.word.sample(),
      startingSemesterYear: 2023,
      startingSemesterSeason: Season.FALL,
      applicationStartDate: new Date(),
      applicationEndDate: new Date(),
      degreeType: DegreeType.UNDERGRADUATE,
      degreeAbbreviation: faker.word.sample(),
      credits: 180,
      descriptionIs: faker.word.sample(),
      descriptionEn: faker.word.sample(),
      durationInYears: durationInYears,
      iscedCode: faker.word.sample(),
      modeOfDelivery: [],
      active: true,
      tmpActive: false,
      allowException: false,
      allowThirdLevelQualification: false,
      applicationPeriodOpen: true,
      applicationInUniversityGateway: true,
    })

    for (let i = 0; i < modeOfDeliveryList.length; i++) {
      await this.get(ProgramModeOfDelivery).create({
        programId: program.id,
        modeOfDelivery: modeOfDeliveryList[i],
      })
    }

    return program
  }
}
