import { Injectable } from '@nestjs/common'

@Injectable()
export class ReferenceTemplateService {
  constructor() {}

  async exampleAction() {
    console.log('Running exampleAction from ReferenceTemplate api module')
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('Done')
  }
}
