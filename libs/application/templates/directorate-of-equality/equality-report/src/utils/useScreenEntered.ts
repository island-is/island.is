import { useEffect, useState } from 'react'

/**
 * False on a field's first commit, true from the next one on.
 *
 * Screen clears every before-submit guard in an effect keyed on
 * activeScreenIndex. React runs a commit's effects child-first, so that clear
 * runs right after the fields of the screen being entered have registered
 * theirs: a guard registered only on mount is gone before the applicant can
 * press anything. A field that lists this flag in its registering effect's
 * dependencies registers once more on the following commit, after the clear.
 */
export const useScreenEntered = () => {
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    setEntered(true)
  }, [])
  return entered
}
