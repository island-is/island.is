import type { StepUpMethod } from './types'

/**
 * How the person logged in to the session asking, from its amr: the Auðkenni
 * app signs with a software key (swk), SIM and card with a hardware key (hwk).
 * Card looks like SIM here, which is fine — without a saved SIM number the
 * identity server falls back to the app.
 */
export const sessionLoginMethod = (
  amr: string[] | undefined,
): StepUpMethod | undefined => {
  if (amr?.includes('swk')) {
    return 'app'
  }
  if (amr?.includes('hwk')) {
    return 'sim'
  }
  return undefined
}
