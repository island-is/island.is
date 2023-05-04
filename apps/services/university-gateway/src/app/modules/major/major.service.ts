import { Injectable } from '@nestjs/common'
import {
  DegreeTypeEnum,
  MajorDetails,
  Major,
  SeasonEnum,
  University,
} from './major.model'
import { uuid } from 'uuidv4'
import { UgReykjavikUniversityClient } from '@island.is/clients/university-gateway/reykjavik-university'

//TODOx connect with new university DB
@Injectable()
export class MajorService {
  constructor(
    private readonly ugReykjavikUniversityClient: UgReykjavikUniversityClient,
  ) {}

  async getUniversities(): Promise<University[]> {
    return [
      {
        id: uuid(),
        name: 'Háskóli Íslands',
      },
      {
        id: uuid(),
        name: 'Háskólinn í Reykjavík',
      },
    ]
  }

  async getMajors(
    year: number,
    season: SeasonEnum,
    universityId: string,
    degreeType: DegreeTypeEnum,
  ): Promise<Major[]> {
    let yearStart: number
    let monthStart: number
    if (season === SeasonEnum.SPRING) {
      yearStart = (year || 2023) - 1
      monthStart = 10
    } else if (season === SeasonEnum.SUMMER) {
      yearStart = year || 2023
      monthStart = 3
    } else if (season === SeasonEnum.FALL) {
      yearStart = year || 2023
      monthStart = 5
    } else {
      yearStart = year || 2023
      monthStart = 5
    }

    // return [
    //   {
    //     id: uuid(),
    //     name: 'Lögfræði',
    //     universityId: universityId || uuid(),
    //     universityName: 'Háskóli Íslands',
    //     degreeType: degreeType || DegreeTypeEnum.UNDERGRADUATE,
    //     degreeAbbreviation: 'BA',
    //     credits: 180,
    //     registrationStart: new Date(yearStart, monthStart, 1),
    //     registrationEnd: new Date(yearStart, monthStart + 3, 1),
    //     year: year || 2023,
    //     season: season || SeasonEnum.FALL,
    //     requireCourseSelection: false,
    //   },
    //   {
    //     id: uuid(),
    //     name: 'Viðskiptafræði',
    //     universityId: universityId || uuid(),
    //     universityName: 'Háskóli Íslands',
    //     degreeType: degreeType || DegreeTypeEnum.UNDERGRADUATE,
    //     degreeAbbreviation: 'BA',
    //     credits: 180,
    //     registrationStart: new Date(yearStart, monthStart, 1),
    //     registrationEnd: new Date(yearStart, monthStart + 3, 1),
    //     year: year || 2023,
    //     season: season || SeasonEnum.FALL,
    //     requireCourseSelection: false,
    //   },
    // ]

    const majors = await this.ugReykjavikUniversityClient.getMajors()
    return majors.map((major) => ({
      id: uuid(),
      name: major.name || '',
      universityId: universityId || uuid(),
      universityName: 'Háskólinn í Reykjavík',
      degreeType: degreeType || DegreeTypeEnum.UNDERGRADUATE,
      degreeAbbreviation: 'BA',
      credits: 180,
      registrationStart: new Date(yearStart, monthStart, 1),
      registrationEnd: new Date(yearStart, monthStart + 3, 1),
      year: year || 2023,
      season: season || SeasonEnum.FALL,
      requireCourseSelection: false,
    }))
  }

  async getMajor(id: string): Promise<Major> {
    return {
      id: id,
      name: 'Lögfræði',
      universityId: uuid(),
      universityName: 'Háskóli Íslands',
      degreeType: DegreeTypeEnum.UNDERGRADUATE,
      degreeAbbreviation: 'BA',
      credits: 180,
      registrationStart: new Date(2023, 5, 1),
      registrationEnd: new Date(2023, 8, 1),
      year: 2023,
      season: SeasonEnum.FALL,
      requireCourseSelection: false,
    }
  }

  async getMajorDetails(id: string): Promise<MajorDetails> {
    return {
      description:
        'Í Lagadeild er spennandi og skemmtilegt umhverfi fyrir nemendur og kennara. Kennslan er nútímaleg og fjölbreytt og tekur mið af því besta sem gerist. Lögð er rík áhersla á gagnvirka kennsluhætti þar sem máttur virkrar samræðu milli kennara og nemanda er nýttur til hins ýtrasta.',
    }
  }
}
