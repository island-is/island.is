import { ApolloError } from 'apollo-client'
import { ServerError } from 'apollo-link-http-common'
import PubSub from 'pubsub-js'

const TYPE = {
  INFO: 'info',
  ERROR: 'error',
  SUCCESS: 'success',
}

class NotificationService {
  info(message: string) {
    PubSub.publish('notifications', {
      message,
      type: TYPE.INFO,
      timeout: 5000,
    })
  }

  success(message: string) {
    PubSub.publish('notifications', {
      message,
      type: TYPE.SUCCESS,
      timeout: 5000,
    })
  }

  error(message: string) {
    PubSub.publish('notifications', {
      message,
      type: TYPE.ERROR,
    })
  }

  onFormError(error: Error) {
    PubSub.publish('notifications', {
      message: error.message,
      type: TYPE.ERROR,
      source: 'form',
    })
  }

  onNetworkError(error: ServerError) {
    const message = error.statusCode
      ? `Network error: Network request failed with status ${error.statusCode}`
      : 'Unable to connect to network'

    PubSub.publish('notifications', {
      message,
      type: TYPE.ERROR,
      source: 'network',
    })
  }

  onGraphQLError(error: ApolloError) {
    PubSub.publish('notifications', {
      message: error.graphQLErrors.map((e) => e.message).join(''),
      type: TYPE.ERROR,
      source: 'graphql',
    })
  }

  subscribe(cb: Function) {
    return PubSub.subscribe(
      'notifications',
      (_: string, notification: string) => cb(notification),
    )
  }

  unsubscribe(value: string) {
    PubSub.unsubscribe(value)
  }
}

const service = new NotificationService()

export default service
