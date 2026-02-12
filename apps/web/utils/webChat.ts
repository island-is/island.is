import type { WatsonIntegration } from '@island.is/web/components'

// Temporary comment

interface WatsonPreSendEvent {
  data: {
    context: {
      skills: {
        ['main skill']: { user_defined: Record<string, unknown> }
      }
    }
  }
}

interface WatsonInstance {
  on: (_: {
    type: string
    handler: (event: WatsonPreSendEvent) => void
  }) => void
  updateHomeScreenConfig: (params: { is_on: boolean }) => void
}

export const setupOneScreenWatsonChatBot = (
  instance: WatsonInstance,
  categoryTitle: string,
  categoryGroup: WatsonIntegration,
) => {
  if (sessionStorage.getItem(categoryGroup) !== categoryTitle) {
    sessionStorage.clear()
  }
  sessionStorage.setItem(categoryGroup, categoryTitle)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const preSendhandler = (event: WatsonPreSendEvent) => {
    event.data.context.skills['main skill'].user_defined[
      `category_${categoryTitle}`
    ] = true
  }
  instance.on({ type: 'pre:send', handler: preSendhandler })

  instance.updateHomeScreenConfig({
    is_on: false,
  })
}
