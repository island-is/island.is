import type { ComponentProps } from 'react'

import {
  StepUpAuthentication as CoreStepUpAuthentication,
  type StepUpMessages,
} from '@island.is/portals/core'

import { m } from '../../lib/messages'

export type {
  StepUpMethod,
  StepUpStart,
  StepUpStatus,
} from '@island.is/portals/core'

const messages: StepUpMessages = {
  title: m.stepUpTitle,
  failedTitle: m.stepUpFailedTitle,
  methodSim: m.stepUpMethodSim,
  methodApp: m.stepUpMethodApp,
  back: m.stepUpBack,
  retry: m.stepUpRetry,
  yourSecurityCode: m.stepUpYourSecurityCode,
  confirmMessageSim: m.stepUpSecurityCodeConfirmMessage,
  confirmMessageApp: m.stepUpSecurityCodeConfirmMessageApp,
  confirmSubtitle: m.stepUpSecurityCodeConfirmSubtitle,
  deniedTitle: m.stepUpDeniedTitle,
  denied: m.stepUpDenied,
  timedOutTitle: m.stepUpTimedOutTitle,
  timedOut: m.stepUpTimedOut,
  expiredTitle: m.confirmDelegationExpiredTitle,
  expired: m.confirmDelegationExpiredMessage,
  refused: m.confirmDelegationFailedMessage,
}

/** The shared step-up screen with the delegation wording. */
export const StepUpAuthentication = (
  props: Omit<ComponentProps<typeof CoreStepUpAuthentication>, 'messages'>,
) => <CoreStepUpAuthentication {...props} messages={messages} />
