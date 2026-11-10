import { consumeFocusQuestionId, setFocusQuestionId } from './focusQuestion'

describe('focusQuestion', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('should store and then consume the focus question id', () => {
    setFocusQuestionId(12)
    expect(consumeFocusQuestionId()).toBe(12)
  })

  it('should clear the id so it only applies once', () => {
    setFocusQuestionId(12)
    consumeFocusQuestionId()
    expect(consumeFocusQuestionId()).toBeUndefined()
  })

  it('should return undefined when nothing was stored', () => {
    expect(consumeFocusQuestionId()).toBeUndefined()
  })

  it('should return undefined when the stored value is not a number', () => {
    sessionStorage.setItem('fss-self-assessment-focus-question', 'not-a-number')
    expect(consumeFocusQuestionId()).toBeUndefined()
  })
})
