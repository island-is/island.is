import { NO } from '@island.is/application/core'
import {
  defaultIncomeTypes,
  TaxLevelOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { FormValue } from '@island.is/application/types'
import { getIncompleteAnswerSections } from './submissionValidation'

const completeCoreAnswers: FormValue = {
  applicantInfo: {
    email: 'mail@mail.is',
    phonenumber: '6611234',
  },
  paymentInfo: {
    bank: {
      bankNumber: '2222',
      ledger: '00',
      accountNumber: '123456',
    },
    personalAllowance: NO,
    taxLevel: TaxLevelOptions.INCOME,
  },
  questions: {
    isPartTimeEmployed: NO,
    isStudying: NO,
  },
  selfAssessmentQuestionsOne: {
    educationalLevel: '1',
  },
}

describe('getIncompleteAnswerSections', () => {
  it('should accept an application with all core sections answered', () => {
    expect(getIncompleteAnswerSections(completeCoreAnswers)).toEqual([])
  })

  it('should report every core section for an application that only holds the prerequisites answers', () => {
    // The answers an application has right after the prerequisites step,
    // matching the empty applications Tryggingastofnun received.
    const emptyAnswers: FormValue = {
      approveExternalData: true,
      incomePlanTable: defaultIncomeTypes,
    }

    expect(getIncompleteAnswerSections(emptyAnswers).sort()).toEqual([
      'applicantInfo',
      'paymentInfo',
      'questions',
      'selfAssessmentQuestionsOne',
    ])
  })

  it('should report a section that is present but holds invalid answers', () => {
    const answers: FormValue = {
      ...completeCoreAnswers,
      applicantInfo: {
        email: '',
        phonenumber: '6611234',
      },
    }

    expect(getIncompleteAnswerSections(answers)).toEqual(['applicantInfo'])
  })

  it('should report a single missing section', () => {
    const { paymentInfo, ...answers } = completeCoreAnswers

    expect(getIncompleteAnswerSections(answers)).toEqual(['paymentInfo'])
  })
})
