import { getModelToken } from '@nestjs/sequelize'
import faker from 'faker'
import { InferCreationAttributes, Model } from 'sequelize'

import { createNationalId } from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { Program } from '../src/app/modules/program/model/program'
import { University } from '../src/app/modules/university/model/university'
import {
  DegreeType,
  ModeOfDelivery,
  Season,
} from '@island.is/university-gateway'

type CreateProgram = Partial<InferCreationAttributes<Program>> &
  Pick<Program, 'universityId'>

export class FixtureFactory {
  constructor(private app: TestApp) {}

  get<T extends new () => Model>(model: T): T {
    return this.app.get(getModelToken(model))
  }

  async createUniversity(numberOfPrograms = 3) {
    const { id: universityId } = await this.get(University).create({
      nationalId: createNationalId('company'),
      contentfulKey: faker.random.word(),
    })

    for (let i = 0; i < numberOfPrograms; i++) {
      await this.createProgram({
        universityId,
      })
    }

    return this.get(University).findByPk(universityId, {
      include: [Program],
    })
  }

  async createProgram({ universityId }: CreateProgram) {
    return this.get(Program).create({
      externalId: faker.datatype.uuid(),
      nameIs: faker.random.word(),
      nameEn: faker.random.word(),
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
      descriptionIs: '',
      descriptionEn: '',
      durationInYears: 3,
      iscedCode: '',
      modeOfDelivery: [ModeOfDelivery.ON_SITE],
      active: true,
      tmpActive: false,
      allowException: false,
      allowThirdLevelQualification: false,
    })
  }
}
