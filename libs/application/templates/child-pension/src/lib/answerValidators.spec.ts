import {
  ApplicationWithAttachments as Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'

import { answerValidators } from './answerValidators'
import { validatorErrorMessages } from './messages'

const createBaseApplication = (): Application => ({
  answers: {
    someAnswer: 'someValue',
    applicationType: { option: 'childPension' },
    registerChildRepeater: [
      {
        name: '',
        // eslint-disable-next-line local-rules/disallow-kennitalas
        nationalIdOrBirthDate: '100123-2230',
        hildDoesNotHaveNationalId: false,
      },
    ],
  },
  assignees: [],
  applicant: '0101307789',
  attachments: {},
  applicantActors: [],
  created: new Date(),
  externalData: {
    childrenCustodyInformation: {
      data: [
        {
          nationalId: '2222222229',
          fullName: 'Stúfur Maack',
          genderCode: '3',
          livesWithApplicant: false,
          livesWithBothParents: false,
          citizenship: {
            code: 'IS',
            name: 'Ísland',
          },
          domicileInIceland: true,
        },
      ],
      date: new Date(),
      status: 'success',
    },
    nationalRegistry: {
      data: {
        age: 93,
        address: {
          city: 'Kópavogur',
          locality: 'Kópavogur',
          postalCode: '200',
          streetAddress: 'Engihjalli 3',
          municipalityCode: '1000',
        },
        fullName: 'Gervimaður útlönd',
        genderCode: '1',
        nationalId: '0101307789',
        citizenship: { code: 'IS', name: 'Ísland' },
      },
      date: new Date('2023-06-06T15:13:50.360Z'),
      status: 'success',
    },
  },
  id: '',
  modified: new Date(),
  state: '',
  typeId: ApplicationTypes.CHILD_PENSION,
  status: ApplicationStatus.IN_PROGRESS,
})

describe('answerValidators', () => {
  let application: Application
  //  const today = new Date()

  beforeEach(() => {
    application = createBaseApplication()
  })

  it('should return an error if missing child national id', () => {
    const newAnswers = [
      {
        name: '',
        nationalIdOrBirthDate: '',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['registerChildRepeater'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.nationalIdRequired,
      path: 'registerChildRepeater[0].nationalIdOrBirthDate',
      values: undefined,
    })
  })

  it('should return an error if missing child birth date', () => {
    const newAnswers = [
      {
        name: '',
        nationalIdOrBirthDate: '',
        childDoesNotHaveNationalId: true,
      },
    ]

    expect(
      answerValidators['registerChildRepeater'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.birthDateRequired,
      path: 'registerChildRepeater[0].nationalIdOrBirthDate',
      values: undefined,
    })
  })

  it('should return an error if missing child name', () => {
    const newAnswers = [
      {
        name: '',
        nationalIdOrBirthDate: '2008-01-01',
        childDoesNotHaveNationalId: true,
      },
    ]

    expect(
      answerValidators['registerChildRepeater'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.nameRequired,
      path: 'registerChildRepeater[0].name',
      values: undefined,
    })
  })

  it('should return an error if children have same national ID', () => {
    const newAnswers = [
      {
        name: 'Nafn Nafnsson',
        // eslint-disable-next-line local-rules/disallow-kennitalas
        nationalIdOrBirthDate: '010105-1450',
        childDoesNotHaveNationalId: false,
      },
      {
        name: 'Nafn Nafnsdóttir',
        // eslint-disable-next-line local-rules/disallow-kennitalas
        nationalIdOrBirthDate: '010105-1450',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['registerChildRepeater'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.nationalIdDuplicate,
      path: 'registerChildRepeater[1].nationalIdOrBirthDate',
      values: undefined,
    })
  })

  it('should return an error if national ID is not valid', () => {
    const newAnswers = [
      {
        name: 'Nafn Nafnsson',
        nationalIdOrBirthDate: '240915-1499',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['registerChildRepeater'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.nationalIdMustBeValid,
      path: 'registerChildRepeater[0].nationalIdOrBirthDate',
      values: undefined,
    })
  })

  it('should return an error if no reason is chosen', () => {
    const newAnswers = [
      {
        name: 'Nafn Nafnsson',
        reason: [],
        nationalIdOrBirthDate: '240915-1499',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['chooseChildren.selectedChildrenInCustody'](
        newAnswers,
        application,
      ),
    ).toStrictEqual({
      message: validatorErrorMessages.childPensionReason,
      path: 'chooseChildren.selectedChildrenInCustody[0].reason',
      values: undefined,
    })
  })

  it('should return an error if more than two reasons are chosen', () => {
    const newAnswers = [
      {
        name: 'Nafn Nafnsson',
        reason: ['parentIsDead', 'parentsPenitentiary', 'childIsFatherless'],
        nationalIdOrBirthDate: '240915-1499',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['chooseChildren.selectedChildrenInCustody'](
        newAnswers,
        application,
      ),
    ).toStrictEqual({
      message: validatorErrorMessages.childPensionMaxTwoReasons,
      path: 'chooseChildren.selectedChildrenInCustody[0].reason',
      values: undefined,
    })
  })

  it('should return an error if child pension reasons do not match', () => {
    const newAnswers = [
      {
        name: 'Nafn Nafnsson',
        reason: ['parentIsDead', 'childIsFatherless'],
        nationalIdOrBirthDate: '240915-1499',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['chooseChildren.selectedChildrenInCustody'](
        newAnswers,
        application,
      ),
    ).toStrictEqual({
      message: validatorErrorMessages.childPensionReasonsDoNotMatch,
      path: 'chooseChildren.selectedChildrenInCustody[0].reason',
      values: undefined,
    })
  })

  it('should return an error if child pension reasons do not match', () => {
    const newAnswers = [
      {
        name: 'Nafn Nafnsson',
        reason: ['parentIsDead', 'parentsPenitentiary'],
        nationalIdOrBirthDate: '240915-1499',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['chooseChildren.selectedChildrenInCustody'](
        newAnswers,
        application,
      ),
    ).toStrictEqual({
      message: validatorErrorMessages.childPensionReasonsDoNotMatch,
      path: 'chooseChildren.selectedChildrenInCustody[0].reason',
      values: undefined,
    })
  })

  it('should return an error if dead parent birth date is missing', () => {
    const newAnswers = [
      {
        name: 'Nafn Nafnsson',
        reason: ['parentIsDead'],
        parentIsDead: [
          {
            nationalIdOrBirthDate: '',
            name: '',
            parentDoesNotHaveNationalId: true,
          },
        ],
        nationalIdOrBirthDate: '240915-1499',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['chooseChildren.selectedChildrenInCustody'](
        newAnswers,
        application,
      ),
    ).toStrictEqual({
      message: validatorErrorMessages.birthDateRequired,
      path: 'chooseChildren.selectedChildrenInCustody[0].parentIsDead[0].nationalIdOrBirthDate',
      values: undefined,
    })
  })

  it('should return an error if dead parent name is missing', () => {
    const newAnswers = [
      {
        name: 'Nafn Nafnsson',
        reason: ['parentIsDead'],
        parentIsDead: [
          {
            nationalIdOrBirthDate: '1988-12-20',
            name: '',
            parentDoesNotHaveNationalId: true,
          },
        ],
        nationalIdOrBirthDate: '240915-1499',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['chooseChildren.selectedChildrenInCustody'](
        newAnswers,
        application,
      ),
    ).toStrictEqual({
      message: validatorErrorMessages.nameRequired,
      path: 'chooseChildren.selectedChildrenInCustody[0].parentIsDead[0].name',
      values: undefined,
    })
  })

  it('should return an error if dead parent national ID is missing', () => {
    const newAnswers = [
      {
        name: 'Nafn Nafnsson',
        reason: ['parentIsDead'],
        parentIsDead: [
          {
            nationalIdOrBirthDate: '',
            name: '',
            parentDoesNotHaveNationalId: false,
          },
        ],
        nationalIdOrBirthDate: '240915-1499',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['chooseChildren.selectedChildrenInCustody'](
        newAnswers,
        application,
      ),
    ).toStrictEqual({
      message: validatorErrorMessages.nationalIdRequired,
      path: 'chooseChildren.selectedChildrenInCustody[0].parentIsDead[0].nationalIdOrBirthDate',
      values: undefined,
    })
  })

  it('should return an error if dead parent national ID is not valid', () => {
    const newAnswers = [
      {
        name: 'Nafn Nafnsson',
        reason: ['parentIsDead'],
        parentIsDead: [
          {
            nationalIdOrBirthDate: '112233-4455',
            name: '',
            parentDoesNotHaveNationalId: false,
          },
        ],
        nationalIdOrBirthDate: '240915-1499',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['chooseChildren.selectedChildrenInCustody'](
        newAnswers,
        application,
      ),
    ).toStrictEqual({
      message: validatorErrorMessages.nationalIdMustBeValid,
      path: 'chooseChildren.selectedChildrenInCustody[0].parentIsDead[0].nationalIdOrBirthDate',
      values: undefined,
    })
  })

  it('should return an error if dead parents have same national ID', () => {
    const newAnswers = [
      {
        name: 'Nafn Nafnsson',
        reason: ['parentIsDead'],
        parentIsDead: [
          {
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalIdOrBirthDate: '010105-1450',
            name: '',
            parentDoesNotHaveNationalId: false,
          },
          {
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalIdOrBirthDate: '010105-1450',
            name: '',
            parentDoesNotHaveNationalId: false,
          },
        ],
        nationalIdOrBirthDate: '240915-1499',
        childDoesNotHaveNationalId: false,
      },
    ]

    expect(
      answerValidators['chooseChildren.selectedChildrenInCustody'](
        newAnswers,
        application,
      ),
    ).toStrictEqual({
      message: validatorErrorMessages.nationalIdDuplicate,
      path: 'chooseChildren.selectedChildrenInCustody[0].parentIsDead[1].nationalIdOrBirthDate',
      values: undefined,
    })
  })

  it('should return an error if no selected child is valid for child pension', () => {
    const newAnswers = {
      year: '2022',
      month: 'March',
    }

    expect(answerValidators['period'](newAnswers, application)).toStrictEqual({
      message: validatorErrorMessages.childPensionNoRightsForPeriod,
      path: 'period',
      values: undefined,
    })
  })

  it('should return an error if there is no attachment uploaded for maintainance', () => {
    const newAnswers = {
      maintenance: [],
    }

    expect(
      answerValidators['fileUpload'](newAnswers, application),
    ).toStrictEqual({
      message: validatorErrorMessages.requireAttachment,
      path: 'fileUpload.maintenance',
      values: undefined,
    })
  })

  it('should return an error if there is no attachment uploaded for notLivesWithApplicant', () => {
    const newAnswers = {
      notLivesWithApplicant: [],
    }

    const newApplication = {
      ...application,
      answers: {
        registerChildRepeater: [],
        chooseChildren: {
          custodyKids: ['2222222229'],
        },
      },
    }

    expect(
      answerValidators['fileUpload'](newAnswers, newApplication),
    ).toStrictEqual({
      message: validatorErrorMessages.requireAttachment,
      path: 'fileUpload.notLivesWithApplicant',
      values: undefined,
    })
  })
})
