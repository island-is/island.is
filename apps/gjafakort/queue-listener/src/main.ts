import { environment } from './environments/environment'
import queueHandlers from './queue-handlers'
import MsgQueue from '@island.is/message-queue'

const { production, exchangeName, queueName } = environment

if (Object.keys(queueHandlers).includes(queueName)) {
  ;(async () => {
    const channel = MsgQueue.connect(production)

    const exchangeId = await channel.declareExchange({ name: exchangeName })
    const queueId = await channel.declareQueue({ name: queueName })
    const dlQueueName = `${queueName}-deadletter`
    const dlQueueId = await channel.declareQueue({ name: dlQueueName })
    await channel.setDlQueue({ queueId, dlQueueId })

    const { handler, routingKeys } = queueHandlers[queueName]
    await channel.bindQueue({ queueId, exchangeId, routingKeys })

    channel.consume({ queueId, handler })

    console.log(`Listening on queue ${queueName}`)
  })().catch((err) => {
    console.error(err)
  })
} else {
  const redText = '\x1b[31m%s\x1b[0m'
  console.error(
    redText,
    `FATAL ERROR: environment variable QUEUE_NAME must be one of [${Object.keys(
      queueHandlers,
    ).join(' ')}]`,
  )
}
