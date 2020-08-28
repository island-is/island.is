import { Actor } from './models/actor'
import Db from 'miragejs/db'
import { Subject, SubjectListDto } from './models/subject'
import { JwtToken } from './models/jwt-model'
export class AuthService {
  private db: Db
  constructor(miragedb: Db) {
    this.db = miragedb
  }

  public getActorByNationalId(nId: string): Actor {
    return this.db.actors.findBy(
      (x: { nationalId: string }) => x.nationalId === nId,
    )
  }

  public getSubjectByNationalId(nId: string): Subject {
    return this.db.subjects.findBy(
      (x: { nationalId: string }) => x.nationalId === nId,
    )
  }

  public mockToken() {
    return new JwtToken()
  }

  public getSubjectListByNationalId(nId: string): SubjectListDto[] {
    const actorEntity = this.getActorByNationalId(nId)

    return actorEntity.subjectIds.map((x: number) => {
      const subject = this.db.subjects.find(x) as Subject
      const subjectListItem: SubjectListDto = {
        nationalId: subject.nationalId,
        name: subject.name,
        subjectType: subject.subjectType,
      }
      return subjectListItem
    })
  }

  public getSubjectForActor(actor: Actor): Subject {
    const availableSubjectEntities: Subject[] = actor.subjectIds.map(
      (x: number) => {
        return this.db.subjects.find(x) as Subject
      },
    )
    const subjectEntity = availableSubjectEntities.find(
      (x) => x.nationalId === actor.nationalId,
    )

    return subjectEntity
  }
}
