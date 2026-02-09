import { Auth } from '@island.is/auth-nest-tools'
import { FetchAPI } from '../gen/fetch'

interface RequestContext {
  fetch: FetchAPI
  url: string
  init: RequestInit
}

export class CustomMiddleware {
  constructor(private entraToken: string) {}

  async pre(context: RequestContext) {
    context.init.headers = Object.assign({}, context.init.headers, {
      authorization: this.entraToken,
    })
  }
}
