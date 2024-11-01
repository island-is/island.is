import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { Cluster } from 'ioredis'
import { REDIS_PUB_SUB } from './pubsub.provider'

@Injectable()
export class PubSubService implements OnModuleInit, OnModuleDestroy {
  private readonly subscriber: Cluster
  private readonly publisher: Cluster

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    @Inject(REDIS_PUB_SUB)
    private readonly cluster: Cluster,
  ) {
    // Duplicate connections for Pub/Sub
    this.subscriber = cluster.duplicate()
    this.publisher = cluster.duplicate()
  }

  async onModuleInit() {
    this.subscriber
      .on('connect', () => this.logger.log('Redis Subscriber connected'))
      .on('error', (error) =>
        this.logger.error('Redis Subscriber error', error),
      )
    this.publisher
      .on('connect', () => this.logger.log('Redis Publisher connected'))
      .on('error', (error) => this.logger.error('Redis Publisher error', error))
  }

  /**
   * Publishes a message to a specified Redis Pub/Sub channel.
   *
   * @param channel - The name of the Redis channel to publish to.
   * @param message - The message to publish to the channel.
   *
   * @returns - A Promise that resolves with the number of clients that received the message.
   */
  async publish({ channel, message }: { channel: string; message: string }) {
    return this.publisher.publish(channel, message)
  }

  /**
   * Subscribes to a specified Redis channel and listens for incoming messages.
   *
   * @param channel - The name of the Redis channel to subscribe to.
   * @param listener - Callback function that triggers when a message is received on the channel.
   *
   * @returns - A Promise that resolves when the subscription is successful.
   */
  async subscribe(
    channel: string,
    listener: (message: string) => void,
  ): Promise<void> {
    await this.subscriber.subscribe(channel)

    this.subscriber.on('message', (chan, message) => {
      if (chan === channel) {
        listener(message)
      }
    })
  }

  /**
   * Unsubscribes from a specified Redis channel.
   */
  async unsubscribe(channel: string) {
    await this.subscriber.unsubscribe(channel)
  }

  async onModuleDestroy() {
    await this.subscriber.quit()
    await this.publisher.quit()
  }
}
