import { User } from '@island.is/auth-nest-tools'
import { Application } from '@island.is/application/core'

export function isNewActor(
  application: Pick<Application, 'applicantActors' | 'applicant'>,
  user: User,
) {
  if (!user.actor) {
    return false
  } else if (
    !application.applicantActors.includes(user.actor.nationalId) &&
    user.nationalId === application.applicant
  ) {
    return true
  } else {
    return false
  }
}
