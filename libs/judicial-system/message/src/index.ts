export { MessageType, messageEndpoint } from './lib/message'
export { type Message } from './lib/message'
export { MessageModule } from './lib/message.module'
export { MessageService } from './lib/message.service'
export {
  MessageMiddleware,
  pushMessagesToRequestStore,
} from './lib/message.middleware'
export { messageModuleConfig } from './lib/message.config'
export {
  messageTypeToSuspensionCategory,
  getMessageSuspensionCategory,
  type SuspensionDecision,
} from './lib/suspension'
