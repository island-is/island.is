import { toExampleQuestions } from './questions'

const messages = [
  { id: 'question1', defaultMessage: 'Fyrsta spurningin?' },
  { id: 'question2', defaultMessage: 'Önnur spurningin?' },
]

/** Stands in for react-intl, which falls back to the default wording */
const formatMessage = ({ defaultMessage }: { defaultMessage?: unknown }) =>
  String(defaultMessage)

describe('toExampleQuestions', () => {
  it('should fall back to the wording in the code when the CMS has no string', () => {
    expect(toExampleQuestions(messages, {}, formatMessage)).toEqual([
      'Fyrsta spurningin?',
      'Önnur spurningin?',
    ])
  })

  it('should prefer the wording the CMS carries', () => {
    expect(
      toExampleQuestions(
        messages,
        { question1: 'Spurning úr vefumsjónarkerfinu?' },
        formatMessage,
      ),
    ).toEqual(['Spurning úr vefumsjónarkerfinu?', 'Önnur spurningin?'])
  })

  it('should leave out a question the CMS has emptied', () => {
    expect(
      toExampleQuestions(messages, { question1: '' }, formatMessage),
    ).toEqual(['Önnur spurningin?'])
  })

  it('should leave out a question the CMS has only put whitespace in', () => {
    expect(
      toExampleQuestions(messages, { question2: '   ' }, formatMessage),
    ).toEqual(['Fyrsta spurningin?'])
  })

  it('should return nothing when every question has been emptied', () => {
    expect(
      toExampleQuestions(
        messages,
        { question1: '', question2: '' },
        formatMessage,
      ),
    ).toEqual([])
  })
})
