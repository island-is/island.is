import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'

import { RentalHousingCategoryClass } from '../utils/constants'
import { propertyInfo as propertyInfoMsgs } from './messages'
import { answerValidators } from './answerValidators'

const createApplication = (
  answers: Record<string, unknown>,
): Application => ({
  id: 'app-id',
  assignees: [],
  applicant: '010130-2399',
  applicantActors: [],
  created: new Date(),
  modified: new Date(),
  state: 'draft',
  status: ApplicationStatus.DRAFT,
  typeId: ApplicationTypes.RENTAL_AGREEMENT_SDF,
  answers,
  externalData: {},
})

describe('rentalAgreementSdf answerValidators', () => {
  it('requires categoryClassGroup for special groups', () => {
    const result = answerValidators['propertyInfo.categoryClass'](
      RentalHousingCategoryClass.SPECIAL_GROUPS,
      createApplication({
        'propertyInfo.categoryClass':
          RentalHousingCategoryClass.SPECIAL_GROUPS,
      }),
    )

    expect(result).toEqual({
      path: 'propertyInfo.categoryClassGroup',
      message: propertyInfoMsgs.categoryClassGroupRequiredError,
    })
  })

  it('passes when special groups has a categoryClassGroup', () => {
    const result = answerValidators['propertyInfo.categoryClassGroup'](
      'students',
      createApplication({
        'propertyInfo.categoryClass':
          RentalHousingCategoryClass.SPECIAL_GROUPS,
        'propertyInfo.categoryClassGroup': 'students',
      }),
    )

    expect(result).toBeUndefined()
  })
})
