import BaseEvent from './BaseEvent'
import { plausibleCustomEvent } from './plausibleEvent'

// User clicks on login button on /minarsidur/ page.
export const webLoginButtonSelect = (buttonType: string) => {
  const event: BaseEvent = {
    eventName: 'Login to /minarsidur',
    featureName: 'web',
    params: {
      buttonType,
    },
  }
  plausibleCustomEvent(event)
}
