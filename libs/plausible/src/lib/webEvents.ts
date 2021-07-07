import BaseEvent from './BaseEvent'
import { plausibleCustomEvent } from './plausibleEvent'

// User clicks on login button on /minarsidur/ page.
export const webLoginButtonSelect = (
  buttonType: string,
  callback?: () => void,
) => {
  const event: BaseEvent = {
    eventName: 'Login to /minarsidur',
    featureName: 'web',
    params: {
      buttonType,
    },
    callback: callback,
  }
  plausibleCustomEvent(event)
}
