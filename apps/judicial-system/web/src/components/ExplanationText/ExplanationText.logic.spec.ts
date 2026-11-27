import { toExplanationLines } from './ExplanationText.logic'

describe('toExplanationLines', () => {
  it('keeps an explanation with newlines as it is', () => {
    expect(toExplanationLines('First\nReason: one\n\nSecond')).toBe(
      'First\nReason: one\n\nSecond',
    )
  })

  it('turns break tags into newlines', () => {
    expect(
      toExplanationLines(
        'First<br/>Reason: one<br/><br/>Second<br>Third<BR />',
      ),
    ).toBe('First\nReason: one\n\nSecond\nThird\n')
  })

  it('reads an explanation with both kinds of line break', () => {
    expect(toExplanationLines('First<br/><br/>Second\n\nThird')).toBe(
      'First\n\nSecond\n\nThird',
    )
  })
})
