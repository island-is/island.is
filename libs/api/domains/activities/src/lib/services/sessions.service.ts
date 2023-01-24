import { User } from '@island.is/auth-nest-tools'

import { SessionDTO } from './types'

export class SessionsService {
  constructor() {
    // Intentionally empty until service is ready
  }

  getSessions(user: User): Promise<SessionDTO[]> {
    return Promise.resolve([])
  }
}
