// RLS answers a duplicate v6 create with 400 — a retry after a lost response, or
// a genuinely pre-existing in-flight application. For an already-paid applicant
// both mean "the application exists", so callers treat it as success rather than
// surfacing the raw error.
//
// The two create endpoints signal it differently (drift reported to RLS): the
// temporary endpoint returns a machine `errorCode` in a plain-JSON body, while
// the full endpoint returns problem+json with only an English `detail`. Check
// both; the English fallback degrades to "not matched" (rethrow) if RLS ever
// changes the wording, which is no worse than having no guard.
export const isApplicationAlreadyExists = (error: unknown): boolean => {
  const e = error as {
    status?: number
    body?: { errorCode?: string }
    problem?: { title?: string; detail?: string }
  }

  if (e?.status !== 400) {
    return false
  }

  // Temporary endpoint: machine code in a plain-JSON body.
  if (e.body?.errorCode === 'APPLICATION_ALREADY_EXISTS') {
    return true
  }

  // Full endpoint: problem+json. By this codebase's convention (see
  // `toSubmissionError`) RLS puts its raw error *code* in `problem.title`, so
  // match that exactly first — the prose `detail` is only a last-resort fallback
  // that degrades safely if RLS ever changes the wording.
  if (e.problem?.title === 'APPLICATION_ALREADY_EXISTS') {
    return true
  }

  const problemText = `${e.problem?.title ?? ''} ${
    e.problem?.detail ?? ''
  }`.toLowerCase()

  return problemText.includes('already exists')
}
