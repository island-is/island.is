import { Injectable } from '@nestjs/common'
import { Message } from './dto/createNotification.dto'

@Injectable()
export class MessageHandlerService {
  public async process(_: Message) {
    // for now we'll just pretend to do some real work
    await new Promise((r) => setTimeout(r, 2_000))
  }
}
