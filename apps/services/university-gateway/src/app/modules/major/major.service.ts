import { Injectable } from '@nestjs/common'
import { MajorDetails, MajorResponse } from './model'
import { uuid } from 'uuidv4'
import { UgReykjavikUniversityClient } from '@island.is/clients/university-gateway/reykjavik-university'
import { DegreeType, InterestTag, PaginateInput, Season } from './types'
import { StudyType } from '../application/types'

//TODOx connect with new university DB

@Injectable()
export class MajorService {
  constructor(
    private readonly ugReykjavikUniversityClient: UgReykjavikUniversityClient,
  ) {}

  async getMajors(
    { after, before, limit }: PaginateInput,
    year: number,
    season: Season,
    universityId: string,
    degreeType: DegreeType,
  ): Promise<MajorResponse> {
    let yearStart: number
    let monthStart: number
    if (season === Season.SPRING) {
      yearStart = (year || 2023) - 1
      monthStart = 10
    } else if (season === Season.FALL) {
      yearStart = year || 2023
      monthStart = 5
    } else {
      yearStart = year || 2023
      monthStart = 5
    }

    const majors = await this.ugReykjavikUniversityClient.getMajors()
    return {
      data: majors.map((major) => ({
        id: uuid(),
        externalId: uuid(),
        nameIs: major.name || '',
        nameEn: major.name || '',
        universityId: universityId || uuid(),
        departmentNameIs: '',
        departmentNameEn: '',
        startingSemesterYear: year || 2023,
        startingSemesterSeason: season || Season.FALL,
        registrationStart: new Date(yearStart, monthStart, 1),
        registrationEnd: new Date(yearStart, monthStart + 3, 1),
        degreeType: degreeType || DegreeType.UNDERGRADUATE,
        degreeAbbreviation: 'BA',
        credits: 180,
        descriptionIs: '',
        descriptionEn: '',
        durationInYears: 3,
        pricePerYear: 75000,
        iscedCode: '',
        externalUrlIs: '',
        externalUrlEn: '',
        studyTypes: [StudyType.ON_SITE],
        interestTags: [InterestTag.ENGINEER],
      })),
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: true,
        startCursor: '',
        endCursor: '',
      },
      totalCount: 100,
    }
  }

  async getMajorDetails(id: string): Promise<MajorDetails> {
    return {
      id: id,
      externalId: uuid(),
      nameIs: 'Tölvunarfræði',
      nameEn: 'Computer sciense',
      universityId: uuid(),
      departmentNameIs: '',
      departmentNameEn: '',
      startingSemesterYear: 2023,
      startingSemesterSeason: Season.FALL,
      registrationStart: new Date(2023, 5, 1),
      registrationEnd: new Date(2023, 5 + 3, 1),
      degreeType: DegreeType.UNDERGRADUATE,
      degreeAbbreviation: 'BA',
      credits: 180,
      descriptionIs: '',
      descriptionEn: '',
      durationInYears: 3,
      pricePerYear: 75000,
      iscedCode: '',
      externalUrlIs: '',
      externalUrlEn: '',
      studyTypes: [StudyType.ON_SITE],
      interestTags: [InterestTag.ENGINEER],
    }
  }
}
