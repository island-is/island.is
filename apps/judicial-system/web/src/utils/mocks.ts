import { User } from '../types'
import { UserRole } from './authenticate'

export const mockProsecutor: User = {
  nationalId: '0123456780',
  role: UserRole.PROSECUTOR,
  id: '292-2929292-92',
  created: '2020-10-05T11:06:35.468Z',
  modified: '2020-10-05T11:06:35.468Z',
  name: 'Batman Robinson',
  title: 'saksóknari',
  mobileNumber: '555-55555',
}

export const mockJudge: User = {
  nationalId: '0123456780',
  role: UserRole.JUDGE,
  id: '292-2929292-92',
  created: '2020-10-05T11:06:35.468Z',
  modified: '2020-10-05T11:06:35.468Z',
  name: 'Wonder Woman',
  title: 'héraðsdómari',
  mobileNumber: '555-55555',
}
