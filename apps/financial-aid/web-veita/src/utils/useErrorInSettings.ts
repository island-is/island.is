import {
  Aid,
  Municipality,
  scrollToId,
} from '@island.is/financial-aid/shared/lib'
import { useState } from 'react'

export const useErrorInSettings = (aidNames: string[]) => {
  const [hasNavError, setHasNavError] = useState(false)
  const [hasAidError, setHasAidError] = useState(false)
  const [hasDecemberCompensationError, setHasDecemberCompensationError] =
    useState(false)

  const errorCheckNav = (state: Municipality) => {
    if (
      state.usingNav &&
      (!state.navUrl || !state.navUsername || !state.navPassword)
    ) {
      setHasNavError(true)
      scrollToId('navSettings')
      return true
    }

    return false
  }

  const errorCheckAid = (aid: Aid, prefix: string, scrollToError: boolean) => {
    const firstErrorAid = Object.entries(aid).find(
      (a) => aidNames.includes(a[0]) && a[1] <= 0,
    )

    if (firstErrorAid === undefined) {
      return false
    }

    setHasAidError(true)
    if (scrollToError) {
      scrollToId(`${prefix}${firstErrorAid[0]}`)
    }
    return true
  }

  const errorCheckDecemberCompensation = (decemberCompensation: number) => {
    if (decemberCompensation === 0) {
      setHasDecemberCompensationError(true)
      scrollToId('input-desember')
      return true
    }

    return false
  }

  const aidChangeHandler = (update: () => void) => {
    setHasAidError(false)
    update()
  }

  const navChangeHandler = (update: () => void) => {
    setHasNavError(false)
    update()
  }

  return {
    hasNavError,
    hasAidError,
    hasDecemberCompensationError,
    errorCheckNav,
    errorCheckAid,
    errorCheckDecemberCompensation,
    aidChangeHandler,
    navChangeHandler,
  }
}
