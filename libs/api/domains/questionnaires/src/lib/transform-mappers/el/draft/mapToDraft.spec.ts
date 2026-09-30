import type { QuestionnaireDetailDto } from '@island.is/clients/health-directorate'
import type { MessageDescriptor } from '@formatjs/intl'
import { AnswerOptionType } from '../../../../models/question.model'
import { mapDraftRepliesToAnswers } from './mapToDraft'

const formatMessage = (
  descriptor: MessageDescriptor | string,
  _values?: Record<string, unknown>,
): string => {
  if (typeof descriptor === 'string') {
    return descriptor
  }
  const translations: Record<string, string> = {
    'sp.health:yes': 'Já',
    'sp.health:no': 'Nei',
  }
  return (
    translations[descriptor.id as string] ||
    (typeof descriptor.defaultMessage === 'string'
      ? descriptor.defaultMessage
      : '')
  )
}

const buildQuestionnaire = (
  items: unknown[],
  replies: unknown[],
): QuestionnaireDetailDto =>
  ({
    questionnaireId: 'q-1',
    groups: [{ items }],
    replies,
  } as unknown as QuestionnaireDetailDto)

const tableQuestion = {
  id: '70',
  type: 'table',
  label: 'Medication',
  items: [
    { id: '71', type: 'string', label: 'Name of drug' },
    { id: '72', type: 'string', label: 'Amount pr. day' },
    { id: '73', type: 'date', label: 'First taken' },
    { id: '74', type: 'bool', label: 'Still taking' },
    { id: '75', type: 'number', label: 'Doses' },
  ],
}

describe('mapDraftRepliesToAnswers', () => {
  it('returns an empty object when there are no replies', () => {
    const result = mapDraftRepliesToAnswers(
      buildQuestionnaire([], []),
      formatMessage,
    )
    expect(result).toEqual({})
  })

  it('skips replies whose question no longer exists', () => {
    const result = mapDraftRepliesToAnswers(
      buildQuestionnaire(
        [{ id: '10', type: 'string', label: 'Q' }],
        [{ questionId: '99', answer: 'orphan' }],
      ),
      formatMessage,
    )
    expect(result).toEqual({})
  })

  it('maps string replies', () => {
    const result = mapDraftRepliesToAnswers(
      buildQuestionnaire(
        [{ id: '10', type: 'string', label: 'Q' }],
        [{ questionId: '10', answer: 'hello' }],
      ),
      formatMessage,
    )
    expect(result['10'].answers).toEqual([{ label: undefined, value: 'hello' }])
  })

  it('maps boolean replies with localized labels', () => {
    const result = mapDraftRepliesToAnswers(
      buildQuestionnaire(
        [{ id: '20', type: 'bool', label: 'Q' }],
        [{ questionId: '20', answer: false }],
      ),
      formatMessage,
    )
    expect(result['20'].answers).toEqual([{ label: 'Nei', value: 'false' }])
    expect(result['20'].type).toBe(AnswerOptionType.radio)
  })

  it('keeps unanswered replies empty instead of stringifying null', () => {
    const result = mapDraftRepliesToAnswers(
      buildQuestionnaire(
        [{ id: '10', type: 'string', label: 'Q' }],
        [{ questionId: '10', answer: null }],
      ),
      formatMessage,
    )
    expect(result['10'].answers).toEqual([])
  })

  it('maps list replies to option ids with labels', () => {
    const result = mapDraftRepliesToAnswers(
      buildQuestionnaire(
        [
          {
            id: '60',
            type: 'list',
            label: 'Q',
            minSelections: 1,
            maxSelections: 0,
            values: [{ id: '63', label: 'Back' }],
          },
        ],
        [{ questionId: '60', values: [{ id: '63', answer: 'Back' }] }],
      ),
      formatMessage,
    )
    expect(result['60'].answers).toEqual([{ label: 'Back', value: '63' }])
  })

  describe('table replies', () => {
    it('tags cells with the EL column type verbatim', () => {
      const result = mapDraftRepliesToAnswers(
        buildQuestionnaire(
          [tableQuestion],
          [
            {
              questionId: '70',
              rows: [
                [
                  { questionId: '71', answer: 'Lyf' },
                  { questionId: '72', answer: '234' },
                  { questionId: '73', answer: '2026-08-19' },
                  { questionId: '74', answer: true },
                  { questionId: '75', answer: 2 },
                ],
              ],
            },
          ],
        ),
        formatMessage,
      )
      expect(result['70'].answers.map((a) => a.value)).toEqual([
        '71:string:Lyf',
        '72:string:234',
        '73:date:2026-08-19',
        '74:bool:true',
        '75:number:2',
      ])
    })

    it('normalizes date cells to YYYY-MM-DD', () => {
      const result = mapDraftRepliesToAnswers(
        buildQuestionnaire(
          [tableQuestion],
          [
            {
              questionId: '70',
              rows: [
                [
                  {
                    questionId: '73',
                    answer: new Date('2026-08-19T10:30:00.000Z'),
                  },
                ],
              ],
            },
          ],
        ),
        formatMessage,
      )
      expect(result['70'].answers.map((a) => a.value)).toEqual([
        '73:date:2026-08-19',
      ])
    })

    it('preserves falsy-but-real cell values like false and 0', () => {
      const result = mapDraftRepliesToAnswers(
        buildQuestionnaire(
          [tableQuestion],
          [
            {
              questionId: '70',
              rows: [
                [
                  { questionId: '74', answer: false },
                  { questionId: '75', answer: 0 },
                ],
              ],
            },
          ],
        ),
        formatMessage,
      )
      expect(result['70'].answers.map((a) => a.value)).toEqual([
        '74:bool:false',
        '75:number:0',
      ])
    })

    it('encodes empty cells with an empty value', () => {
      const result = mapDraftRepliesToAnswers(
        buildQuestionnaire(
          [tableQuestion],
          [
            {
              questionId: '70',
              rows: [[{ questionId: '71', answer: null }]],
            },
          ],
        ),
        formatMessage,
      )
      expect(result['70'].answers.map((a) => a.value)).toEqual(['71:string:'])
    })

    it('ignores cells whose column no longer exists', () => {
      const result = mapDraftRepliesToAnswers(
        buildQuestionnaire(
          [tableQuestion],
          [
            {
              questionId: '70',
              rows: [[{ questionId: '99', answer: 'orphan' }]],
            },
          ],
        ),
        formatMessage,
      )
      expect(result['70'].answers).toEqual([])
    })
  })
})
