import { Injectable } from '@nestjs/common'

@Injectable()
export class FormService {
  getData(): { message: string } {
    return { message: 'Hello FORM' }
  }
}
