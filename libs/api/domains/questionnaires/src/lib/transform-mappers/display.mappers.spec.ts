import { mapLshQuestionnaire } from './lsh/display/mapQuestionnaire'
import { mapELQuestionnaire } from './el/display/mapQuestionnaire'
import { AnswerOptionType } from '../../models/question.model'
import {
  QuestionnairesOrganizationEnum,
  QuestionnairesStatusEnum,
} from '../../models/questionnaires.model'
import type { QuestionnaireBody } from '@island.is/clients/lsh'
import type { QuestionnaireDetailDto } from '@island.is/clients/health-directorate'
import type { MessageDescriptor } from '@formatjs/intl'

// Mock formatMessage function
const formatMessage = (
  descriptor: MessageDescriptor | string,
  _values?: Record<string, unknown>,
): string => {
  if (typeof descriptor === 'string') {
    return descriptor
  }

  // Mock translations for tests
  const translations: Record<string, string> = {
    'sp.health:yes': 'Já',
    'sp.health:no': 'Nei',
  }

  const defaultMessage =
    typeof descriptor.defaultMessage === 'string'
      ? descriptor.defaultMessage
      : ''
  return translations[descriptor.id as string] || defaultMessage || ''
}

describe('display mappers', () => {
  describe('LSH questionnaire mapping', () => {
    it('maps a full LSH questionnaire into internal Questionnaire format', () => {
      const lshForm = {
        gUID: 'lsh-guid-1',
        formID: 'lsh-form-1',
        header: 'LSH Header',
        description: 'LSH description',
        sections: [
          {
            caption: 'Section 1',
            questions: [
              {
                entryID: 'Q1',
                question: 'Select an option',
                description: 'Some description',
                type: 'SingleSelect',
                slider: '0',
                instructions: 'Choose one',
                options: [
                  { label: 'Option A', value: 'A' },
                  { label: 'Option B', value: 'B' },
                ],
                minValue: null,
                maxValue: null,
                maxLength: null,
                formula: null,
                visible: 'true',
                dependsOn: null,
                required: true,
              },
            ],
          },
        ],
      } as unknown as QuestionnaireBody

      const mapped = mapLshQuestionnaire(lshForm)

      expect(mapped.baseInformation.id).toBe('lsh-guid-1')
      expect(mapped.baseInformation.formId).toBe('lsh-form-1')
      expect(mapped.baseInformation.title).toBe('LSH Header')
      expect(mapped.baseInformation.description).toBe('LSH description')
      expect(mapped.baseInformation.organization).toBe(
        QuestionnairesOrganizationEnum.LSH,
      )

      expect(mapped.sections).toHaveLength(1)
      const section = mapped.sections?.[0]
      expect(section?.title).toBe('Section 1')
      expect(section?.questions).toHaveLength(1)

      const question = section?.questions?.[0]
      expect(question?.id).toBe('Q1')
      expect(question?.label).toBe('Select an option')
      expect(question?.answerOptions.type).toBe(AnswerOptionType.radio)
      expect(question?.answerOptions.options).toEqual([
        { id: 'A-Option A', label: 'Option A', value: 'A' },
        { id: 'B-Option B', label: 'Option B', value: 'B' },
      ])
    })

    it('derives dependsOn from visibility expression when referencing another question', () => {
      const lshForm = {
        gUID: 'lsh-guid-2',
        formID: 'lsh-form-2',
        header: 'LSH With Visibility',
        description: null,
        sections: [
          {
            caption: 'Section',
            questions: [
              {
                entryID: 'Q1',
                question: 'Source question',
                description: null,
                type: 'SingleSelect',
                slider: '0',
                instructions: null,
                options: [{ label: 'Yes', value: 'yes' }],
                minValue: null,
                maxValue: null,
                maxLength: null,
                formula: null,
                visible: 'true',
                dependsOn: null,
                required: false,
              },
              {
                entryID: 'Q2',
                question: 'Dependent question',
                description: null,
                type: 'String',
                slider: '0',
                instructions: null,
                options: null,
                minValue: null,
                maxValue: null,
                maxLength: null,
                formula: null,
                // Visible when Q1 has value "yes"
                visible: "@@@Q1 == 'yes'",
                dependsOn: null,
                required: false,
              },
            ],
          },
        ],
      } as unknown as QuestionnaireBody

      const mapped = mapLshQuestionnaire(lshForm)

      const section = mapped.sections?.[0]
      const dependentQuestion = section?.questions?.find((q) => q.id === 'Q2')

      expect(dependentQuestion?.visibilityConditions).toBeDefined()
      expect(dependentQuestion?.visibilityConditions?.[0].questionId).toBe('Q1')
      // dependsOn should include Q1 based on the visibility expression
      expect(dependentQuestion?.dependsOn).toEqual(['Q1'])
    })

    it('merges explicit dependsOn and visibility-based dependencies without duplicates', () => {
      const lshForm = {
        gUID: 'lsh-guid-3',
        formID: 'lsh-form-3',
        header: 'LSH With explicit dependsOn',
        description: null,
        sections: [
          {
            caption: 'Section',
            questions: [
              {
                entryID: 'Q1',
                question: 'Source A',
                description: null,
                type: 'SingleSelect',
                slider: '0',
                instructions: null,
                options: [{ label: 'Yes', value: 'yes' }],
                minValue: null,
                maxValue: null,
                maxLength: null,
                formula: null,
                visible: 'true',
                dependsOn: null,
                required: false,
              },
              {
                entryID: 'Q2',
                question: 'Source B',
                description: null,
                type: 'SingleSelect',
                slider: '0',
                instructions: null,
                options: [{ label: 'Yes', value: 'yes' }],
                minValue: null,
                maxValue: null,
                maxLength: null,
                formula: null,
                visible: 'true',
                dependsOn: null,
                required: false,
              },
              {
                entryID: 'Q3',
                question: 'Dependent on Q1 and Q2',
                description: null,
                type: 'String',
                slider: '0',
                instructions: null,
                options: null,
                minValue: null,
                maxValue: null,
                maxLength: null,
                formula: null,
                // Visibility references Q1, explicit dependsOn also includes Q1 and Q2
                visible: "@@@Q1 == 'yes'",
                dependsOn: ['Q1', 'Q2'],
                required: false,
              },
            ],
          },
        ],
      } as unknown as QuestionnaireBody

      const mapped = mapLshQuestionnaire(lshForm)

      const section = mapped.sections?.[0]
      const dependentQuestion = section?.questions?.find((q) => q.id === 'Q3')

      expect(dependentQuestion?.visibilityConditions?.[0].questionId).toBe('Q1')
      // dependsOn should contain both Q1 (from visibility + explicit) and Q2 (explicit only), without duplicates
      expect(dependentQuestion?.dependsOn?.sort()).toEqual(['Q1', 'Q2'])
    })
  })

  describe('EL questionnaire mapping', () => {
    it('maps a detailed EL questionnaire into internal Questionnaire format', () => {
      const expiryDate = new Date('2030-01-01T00:00:00.000Z')

      const elDetail = {
        questionnaireId: 'el-q-1',
        title: 'EL Title',
        message: 'EL description',
        // Detailed questionnaires have groups, triggers and submissions
        groups: [
          {
            id: 'group-1',
            title: 'Group 1',
            items: [
              {
                id: 'bool-q1',
                type: 'bool',
                label: 'Are you OK?',
                htmlLabel: '<p>Are you OK?</p>',
                hint: 'Please answer',
                required: true,
              },
            ],
          },
        ],
        triggers: {},
        submissions: [],
        replies: [],
        canSubmit: true,
        expiryDate,
      } as unknown as QuestionnaireDetailDto

      const mapped = mapELQuestionnaire(elDetail, formatMessage)

      expect(mapped.baseInformation.id).toBe('el-q-1')
      expect(mapped.baseInformation.formId).toBe('el-q-1')
      expect(mapped.baseInformation.title).toBe('EL Title')
      expect(mapped.baseInformation.description).toBe('EL description')
      expect(mapped.baseInformation.organization).toBe(
        QuestionnairesOrganizationEnum.EL,
      )
      expect(mapped.baseInformation.status).toBe(
        QuestionnairesStatusEnum.notAnswered,
      )

      expect(mapped.expirationDate).toEqual(expiryDate)
      expect(mapped.canSubmit).toBe(true)

      expect(mapped.sections).toHaveLength(1)
      const section = mapped.sections?.[0]
      expect(section?.id).toBe('group-1')
      expect(section?.title).toBe('Group 1')
      expect(section?.questions).toHaveLength(1)

      const question = section?.questions?.[0]
      expect(question?.id).toBe('group-1__bool-q1')
      expect(question?.originalId).toBe('bool-q1')
      expect(question?.label).toBe('Are you OK?')
      expect(question?.answerOptions.type).toBe(AnswerOptionType.radio)

      // Boolean questions should get localized Yes/No options
      expect(question?.answerOptions.options).toEqual([
        { id: 'true', value: 'true', label: 'Já' },
        { id: 'false', value: 'false', label: 'Nei' },
      ])
    })

    it('sets dependsOn and visibilityConditions for EL question triggers', () => {
      const elDetail = {
        questionnaireId: 'el-q-2',
        title: 'With triggers',
        message: null,
        groups: [
          {
            id: 'group-1',
            title: 'Group 1',
            items: [
              {
                id: 'q1',
                type: 'bool',
                label: 'Do you smoke?',
                htmlLabel: '<p>Do you smoke?</p>',
                hint: null,
                required: false,
              },
              {
                id: 'q2',
                type: 'string',
                label: 'How many per day?',
                htmlLabel: '<p>How many per day?</p>',
                hint: null,
                required: false,
              },
            ],
          },
        ],
        // Trigger: show q2 when q1 === true
        triggers: {
          trigger1: [
            {
              triggerId: 'q1',
              targetId: 'q2',
              visible: true,
              value: true,
            },
          ],
        },
        submissions: [],
        replies: [],
        canSubmit: true,
        expiryDate: null,
      } as unknown as QuestionnaireDetailDto

      const mapped = mapELQuestionnaire(elDetail, formatMessage)

      const section = mapped.sections?.[0]
      const dependentQuestion = section?.questions?.find(
        (q) => q.id === 'group-1__q2',
      )

      // q2 should depend on q1 via triggers (dependsOn uses original IDs, not namespaced)
      expect(dependentQuestion?.dependsOn).toEqual(['q1'])
      expect(dependentQuestion?.visibilityConditions).toBeDefined()
      expect(dependentQuestion?.visibilityConditions?.[0].questionId).toBe('q1')
    })
  })
})
