import APIResponse from '../entities/common/APIResponse'
import { BehaviorSubject } from 'rxjs'

export class ApiStatusStore {
  constructor() {
    this.status = new BehaviorSubject<APIResponse>(new APIResponse())
  }

  public status: BehaviorSubject<APIResponse>

  public setStatus(response: APIResponse): void {
    this.status.next(response)
  }

  public clearStatus(): void {
    this.status.next(new APIResponse())
  }

  static store: ApiStatusStore

  static getInstance(): ApiStatusStore {
    if (!ApiStatusStore.store) {
      ApiStatusStore.store = new ApiStatusStore()
    }

    return ApiStatusStore.store
  }
}
