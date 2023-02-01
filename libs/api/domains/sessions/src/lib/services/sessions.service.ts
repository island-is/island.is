import { User } from '@island.is/auth-nest-tools'

import { PaginatedSessionDto, SessionDto } from './types'
import { PaginatedSessionResponse } from '../dto/paginated-session.response'

const mockData = [
  // Gervimadur session as company
  {
    id: '123456789',
    actorNationalId: '0101307789',
    subjectNationalId: '5005101370',
    clientId: '@island.is/web',
    timestamp: '2023-01-01T12:00:00.000Z',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    ip: '0.0.0.0',
    ipLocation: 'Reykjavík',
  },
  // Gervimadur as self
  {
    id: '987654821',
    actorNationalId: '0101307789',
    subjectNationalId: '0101307789',
    clientId: '@island.is/web',
    timestamp: '2023-02-03T13:00:00.000Z',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    ip: '0.0.0.0',
    ipLocation: 'Reykjavík',
  },
  // Gervimadur as another user
  {
    id: '987654321',
    actorNationalId: '0101307789',
    subjectNationalId: '0101302399',
    clientId: '@island.is/web',
    timestamp: '2022-12-11T13:00:00.000Z',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    ip: '0.0.0.0',
    ipLocation: 'Reykjavík',
  },
  // Other user onbehalf of gervimadur
  {
    id: '987654391',
    actorNationalId: '0101302399',
    subjectNationalId: '0101307789',
    clientId: '@island.is/web',
    timestamp: '2022-10-11T13:00:00.000Z',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    ip: '0.0.0.0',
    ipLocation: 'Reykjavík',
  },
] as SessionDto[]

export class SessionsService {
  constructor() {
    // Intentionally empty until service is ready
  }

  getSessions(user: User): Promise<PaginatedSessionDto> {
    const result = mockData.filter(
      (session) =>
        session.actorNationalId === user.nationalId ||
        session.subjectNationalId === user.nationalId,
    )

    return Promise.resolve({
      totalCount: result.length,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
        endCursor: '',
      },
      data: result,
    })
  }
}
