export const wait = async (seconds = 2) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1_000))
}

export const DECEASED_STATUS = 'LÉST' as const

export const INACTIVE_COMPANY_STATUS = 'Afskráð' as const

/**
 * Tracks the messages on the queues of a test, to wait for the workers to process them
 * instead of waiting a fixed time (which fails on a busy machine, e.g. in CI).
 *
 * A worker confirms a message by deleting it from the queue when its handler is done. A handler
 * may add messages to other queues (email, sms, push, actor notifications) before that, so
 * those are pending before the message that caused them is gone.
 */
export class QueueTracker {
  private pending = new Set<string>()

  /** Spies on the client(s) every queue of the app uses */
  track(client: {
    add: (url: string, message: unknown) => Promise<string>
    deleteMessages: (
      url: string,
      messages: { MessageId?: string }[],
    ) => Promise<void>
  }) {
    const add = client.add.bind(client)
    jest.spyOn(client, 'add').mockImplementation(async (url, message) => {
      const id = await add(url, message)
      this.pending.add(id)
      return id
    })
    const deleteMessages = client.deleteMessages.bind(client)
    jest
      .spyOn(client, 'deleteMessages')
      .mockImplementation(async (url, messages) => {
        await deleteMessages(url, messages)
        for (const { MessageId } of messages) {
          if (MessageId) this.pending.delete(MessageId)
        }
      })
  }

  /** Forget the messages of a previous test */
  reset() {
    this.pending.clear()
  }

  /**
   * Waits until every message added since the last reset has been processed. A message whose
   * handler throws is not deleted (it is delivered again), so such a test times out here.
   */
  async waitForProcessing(timeoutMs = 20_000) {
    const start = Date.now()
    while (this.pending.size > 0) {
      if (Date.now() - start > timeoutMs) {
        throw new Error(
          `${this.pending.size} queue message(s) not processed within ${timeoutMs} ms`,
        )
      }
      await wait(0.05)
    }
  }
}
