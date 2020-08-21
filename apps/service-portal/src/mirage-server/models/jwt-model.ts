import { Actor, ActorDto } from './actor'
import { Subject, SubjectDto } from './subject'
import { addHours, format } from 'date-fns'
import jwtDecode from 'jwt-decode'

export class JwtToken {
  actor: ActorDto
  sub: SubjectDto
  exp: string
  iat: string

  constructor(actor: Actor, subject: Subject) {
    const sub: SubjectDto = {
      name: subject.name,
      nationalId: subject.nationalId,
      scope: subject.scope,
      subjectType: subject.subjectType,
    }

    const act: ActorDto = {
      name: actor.name,
      nationalId: actor.nationalId,
    }

    this.actor = act
    this.sub = sub
    const issueDate: Date = new Date()
    this.iat = format(issueDate, 'T')
    this.exp = format(addHours(issueDate, 2), 'T')
  }
}

export class JwtUtils {
  static async parseJwt(token: string): Promise<JwtToken> {
    return await jwtDecode(token)
  }
}
