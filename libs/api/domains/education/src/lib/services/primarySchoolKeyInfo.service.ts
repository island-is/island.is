import { Injectable, NotFoundException } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { FriggKeyInfoClientService } from '@island.is/clients/mms/frigg'
import { PrimarySchoolClientService } from '@island.is/clients/mms/primary-school'

/**
 * Translates between the two child identities the primary-school screens deal
 * with. The frontend routes on the nemendagrunnur student id (the id behind the
 * student list, overview and assessments), while frigg — which backs key
 * information — keys children on its own id (base.users.id from the data
 * gateway). The only field the two backends share is the national id.
 *
 * The reads hang off {@link PrimarySchoolStudent} and already have the national
 * id from the parent, so they translate it through
 * {@link PrimarySchoolChildIdLoader} instead. This service is what the mutations
 * use, which start from a routed student id and have to look the national id up.
 */
@Injectable()
export class PrimarySchoolKeyInfoService {
  constructor(
    private readonly keyInfoClient: FriggKeyInfoClientService,
    private readonly primarySchoolClient: PrimarySchoolClientService,
  ) {}

  /**
   * The frigg child id for a national id, or null when the child has no
   * counterpart in frigg (e.g. not yet registered in MMS).
   */
  async findChildId(
    user: User,
    nationalId?: string | null,
  ): Promise<string | null> {
    if (!nationalId) return null
    const children = await this.keyInfoClient.getChildren(user)
    return children.find((child) => child.nationalId === nationalId)?.id ?? null
  }

  /**
   * As {@link findChildId}, but starting from a routed student id and throwing
   * when there is no match — for mutations, which cannot act on a child that
   * does not exist in frigg. Mutations are not nested under the student, so the
   * national id has to be looked up from the student list first.
   */
  async requireChildIdForStudent(
    user: User,
    studentId: string,
  ): Promise<string> {
    const students = await this.primarySchoolClient.getStudents(user)
    const nationalId = students?.find((s) => s.id === studentId)?.nationalId
    const childId = await this.findChildId(user, nationalId)
    if (!childId) {
      throw new NotFoundException(
        `No key-information child found for student ${studentId}`,
      )
    }
    return childId
  }
}
