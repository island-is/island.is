import { SessionsSession } from '@island.is/api/schema'
import * as kennitala from 'kennitala'
import { SessionType } from '../lib/types/sessionTypes'
export const getSessionType = (
  session: SessionsSession,
  userNationalId: string,
): SessionType => {
  if (kennitala.isCompany(userNationalId)) {
    return SessionType.company
  }
  if (session.actor.nationalId === session.subject.nationalId) {
    return SessionType.self
  }
  if (session.actor.nationalId === userNationalId) {
    return SessionType.onBehalf
  }
  if (session.subject.nationalId === userNationalId) {
    return SessionType.myBehalf
  }
  return SessionType.self
}
