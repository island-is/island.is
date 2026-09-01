import type { MessageDescriptor } from '@formatjs/intl'
import { AnswerOptionType } from '../../../../models/question.model'
import { QuestionnairesOrganizationEnum } from '../../../../models/questionnaires.model'
import { QuestionnaireInput } from '../../../dto/questionnaire.input'
import { mapToElAnswer } from './mapToELAnswer'

const formatMessage = (
  descriptor: MessageDescriptor | string,
  _values?: Record<string, unknown>,
): string => {
  if (typeof descriptor === 'string') {
    return descriptor
  }
  return typeof descriptor.defaultMessage === 'string'
    ? descriptor.defaultMessage
    : ''
}

const buildInput = (
  entries: QuestionnaireInput['entries'],
  saveAsDraft?: boolean,
): QuestionnaireInput => ({
  id: 'questionnaire-1',
  organization: QuestionnairesOrganizationEnum.EL,
  formId: 'form-1',
  entries,
  saveAsDraft,
})

const entry = (
  entryId: string,
  type: AnswerOptionType,
  answers: Array<{ label?: string; value: string }>,
) => ({ entryId, type, answers })

describe('mapToElAnswer', () => {
  it('maps text answers to string replies', () => {
    const result = mapToElAnswer(
      buildInput([entry('10', AnswerOptionType.textarea, [{ value: 'hello' }])]),
      formatMessage,
    )
    expect(result.replies).toEqual([{ questionId: '10', answer: 'hello' }])
  })

  it('sets isDraft from saveAsDraft and defaults to false', () => {
    expect(mapToElAnswer(buildInput([], true), formatMessage).isDraft).toBe(
      true,
    )
    expect(mapToElAnswer(buildInput([]), formatMessage).isDraft).toBe(false)
  })

  it('omits entries without answers', () => {
    const result = mapToElAnswer(
      buildInput([entry('10', AnswerOptionType.text, [])]),
      formatMessage,
    )
    expect(result.replies).toEqual([])
  })

  describe('radio', () => {
    it('maps true/false values to boolean replies', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('20', AnswerOptionType.radio, [
            { label: 'Nei', value: 'false' },
          ]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([{ questionId: '20', answer: false }])
    })

    it('maps list options to a single-value list reply', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('50', AnswerOptionType.radio, [
            { label: 'It is getting worse', value: '53' },
          ]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        {
          questionId: '50',
          values: [{ id: '53', answer: 'It is getting worse' }],
        },
      ])
    })

    it('falls back to the option value when the label is missing', () => {
      const result = mapToElAnswer(
        buildInput([entry('50', AnswerOptionType.radio, [{ value: '53' }])]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        { questionId: '50', values: [{ id: '53', answer: '53' }] },
      ])
    })
  })

  describe('checkbox and slider', () => {
    it('maps all selected options to a list reply', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('60', AnswerOptionType.checkbox, [
            { label: 'Head', value: '61' },
            { label: 'Back', value: '63' },
          ]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        {
          questionId: '60',
          values: [
            { id: '61', answer: 'Head' },
            { id: '63', answer: 'Back' },
          ],
        },
      ])
    })

    it('maps slider selections to a list reply', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('65', AnswerOptionType.slider, [
            { label: 'Medium', value: '2' },
          ]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        { questionId: '65', values: [{ id: '2', answer: 'Medium' }] },
      ])
    })
  })

  describe('date and datetime', () => {
    it('passes date strings through', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('30', AnswerOptionType.date, [{ value: '2017-11-01' }]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        { questionId: '30', answer: '2017-11-01' },
      ])
    })

    it('omits cleared date answers instead of sending an empty string', () => {
      const result = mapToElAnswer(
        buildInput([entry('30', AnswerOptionType.date, [{ value: '' }])]),
        formatMessage,
      )
      expect(result.replies).toEqual([])
    })
  })

  describe('number, scale and thermometer', () => {
    it('maps numeric strings to number replies', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('40', AnswerOptionType.number, [{ value: '8' }]),
          entry('80', AnswerOptionType.scale, [{ value: '4.5' }]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        { questionId: '40', answer: 8 },
        { questionId: '80', answer: 4.5 },
      ])
    })

    it('omits empty, non-numeric and partially numeric values', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('40', AnswerOptionType.number, [{ value: '' }]),
          entry('41', AnswerOptionType.number, [{ value: 'wer' }]),
          entry('42', AnswerOptionType.number, [{ value: '12abc' }]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([])
    })
  })

  describe('table', () => {
    it('respects declared column types instead of inferring from values', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('70', AnswerOptionType.table, [
            { label: 'Name', value: '71:string:Lyf' },
            { label: 'Amount', value: '72:string:234' },
            { label: 'First taken', value: '73:date:2026-08-19' },
          ]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        {
          questionId: '70',
          rows: [
            [
              { questionId: '71', answer: 'Lyf' },
              { questionId: '72', answer: '234' },
              { questionId: '73', answer: '2026-08-19' },
            ],
          ],
        },
      ])
    })

    it('maps bool and number columns to typed answers', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('70', AnswerOptionType.table, [
            { value: '74:bool:true' },
            { value: '75:number:2.5' },
          ]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        {
          questionId: '70',
          rows: [
            [
              { questionId: '74', answer: true },
              { questionId: '75', answer: 2.5 },
            ],
          ],
        },
      ])
    })

    it('groups repeated columns into separate rows', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('70', AnswerOptionType.table, [
            { value: '71:string:First' },
            { value: '72:number:1' },
            { value: '71:string:Second' },
            { value: '72:number:2' },
          ]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        {
          questionId: '70',
          rows: [
            [
              { questionId: '71', answer: 'First' },
              { questionId: '72', answer: 1 },
            ],
            [
              { questionId: '71', answer: 'Second' },
              { questionId: '72', answer: 2 },
            ],
          ],
        },
      ])
    })

    it('skips empty non-string cells but keeps empty string cells', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('70', AnswerOptionType.table, [
            { value: '71:string:' },
            { value: '73:date:' },
            { value: '75:number:' },
          ]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        {
          questionId: '70',
          rows: [[{ questionId: '71', answer: '' }]],
        },
      ])
    })

    it('skips number cells whose value is not numeric', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('70', AnswerOptionType.table, [
            { value: '71:string:Lyf' },
            { value: '75:number:abc' },
          ]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        {
          questionId: '70',
          rows: [[{ questionId: '71', answer: 'Lyf' }]],
        },
      ])
    })

    it('skips number cells with partially numeric values', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('70', AnswerOptionType.table, [
            { value: '71:string:Lyf' },
            { value: '75:number:12abc' },
          ]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        {
          questionId: '70',
          rows: [[{ questionId: '71', answer: 'Lyf' }]],
        },
      ])
    })

    it('treats a legacy value with colons as a string, not a typed cell', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('70', AnswerOptionType.table, [{ value: 'note:08:30' }]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        {
          questionId: '70',
          rows: [[{ questionId: 'note', answer: '08:30' }]],
        },
      ])
    })

    it('keeps partially numeric legacy values as strings', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('70', AnswerOptionType.table, [{ value: '72:12abc' }]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        {
          questionId: '70',
          rows: [[{ questionId: '72', answer: '12abc' }]],
        },
      ])
    })

    it('omits the table reply when no row has any valid cell', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('70', AnswerOptionType.table, [
            { value: '73:date:' },
            { value: '75:number:' },
          ]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([])
    })

    it('keeps colons inside cell values intact', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('70', AnswerOptionType.table, [
            { value: '71:string:10:30 daily' },
          ]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        {
          questionId: '70',
          rows: [[{ questionId: '71', answer: '10:30 daily' }]],
        },
      ])
    })

    it('infers types for the legacy two-part format', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('70', AnswerOptionType.table, [
            { value: '71:some text' },
            { value: '72:234' },
            { value: '73:2026-08-05' },
            { value: '74:true' },
          ]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        {
          questionId: '70',
          rows: [
            [
              { questionId: '71', answer: 'some text' },
              { questionId: '72', answer: 234 },
              { questionId: '73', answer: '2026-08-05' },
              { questionId: '74', answer: true },
            ],
          ],
        },
      ])
    })

    it('does not infer a number from a legacy date value', () => {
      const result = mapToElAnswer(
        buildInput([
          entry('70', AnswerOptionType.table, [{ value: '73:2026-08-05' }]),
        ]),
        formatMessage,
      )
      expect(result.replies).toEqual([
        {
          questionId: '70',
          rows: [[{ questionId: '73', answer: '2026-08-05' }]],
        },
      ])
    })
  })

  describe('fallback', () => {
    it('maps true/false strings from untyped entries to boolean replies', () => {
      const result = mapToElAnswer(
        buildInput([entry('90', AnswerOptionType.text, [{ value: 'true' }])]),
        formatMessage,
      )
      expect(result.replies).toEqual([{ questionId: '90', answer: true }])
    })

    it('defaults everything else to string replies', () => {
      const result = mapToElAnswer(
        buildInput([entry('91', AnswerOptionType.text, [{ value: 'plain' }])]),
        formatMessage,
      )
      expect(result.replies).toEqual([{ questionId: '91', answer: 'plain' }])
    })
  })
})
