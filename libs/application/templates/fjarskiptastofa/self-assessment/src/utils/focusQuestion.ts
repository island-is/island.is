// Lets the overview's edit buttons tell the assessment screen which question to
// jump to. sessionStorage is used (rather than an answer) so it survives the
// in-app navigation without being persisted as application data.
const FOCUS_KEY = 'fss-self-assessment-focus-question'

export const setFocusQuestionId = (questionId: number) => {
  try {
    sessionStorage.setItem(FOCUS_KEY, String(questionId))
  } catch {
    // sessionStorage can be unavailable (private mode, SSR); ignore.
  }
}

// Reads and clears the pending focus target, so it only applies once.
export const consumeFocusQuestionId = (): number | undefined => {
  try {
    const raw = sessionStorage.getItem(FOCUS_KEY)
    if (raw == null) return undefined
    sessionStorage.removeItem(FOCUS_KEY)
    const id = Number(raw)
    return Number.isNaN(id) ? undefined : id
  } catch {
    return undefined
  }
}
