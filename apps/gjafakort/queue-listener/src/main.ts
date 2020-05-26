import { environment } from './environments/environment'
import queueHandlers from './queue-handlers'
import MsgQueue, { ApplicationMessage } from '@island.is/message-queue'

const { production, exchangeName } = environment

const listen = async (
  queueName: string,
  handler: (message: ApplicationMessage) => Promise<void>,
  routingKeys: string[],
) => {
  const channel = MsgQueue.connect(production)

  const exchangeId = await channel.declareExchange({ name: exchangeName })
  const queueId = await channel.declareQueue({ name: queueName })
  const dlQueueName = `${queueName}-deadletter`
  const dlQueueId = await channel.declareQueue({ name: dlQueueName })
  await channel.setDlQueue({ queueId, dlQueueId })
  await channel.bindQueue({ queueId, exchangeId, routingKeys })

  channel.consume({ queueId, handler })
}

Object.keys(queueHandlers).forEach((queueName: string) => {
  const { handler, routingKeys } = queueHandlers[queueName]
  listen(queueName, handler, routingKeys).then(() => {
    console.log(`Listening on queue ${queueName}`)
  })
})
