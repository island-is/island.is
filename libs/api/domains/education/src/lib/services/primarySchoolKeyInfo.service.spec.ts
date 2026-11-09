import { NotFoundException } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import type { FriggKeyInfoClientService } from '@island.is/clients/mms/frigg'
import type { PrimarySchoolClientService } from '@island.is/clients/mms/primary-school'

import { PrimarySchoolKeyInfoService } from './primarySchoolKeyInfo.service'

const user = {} as User

const child = (nationalId: string, id: string) => ({ nationalId, id })
const student = (id: string, nationalId?: string) => ({ id, nationalId })

const setup = (
  children: Array<{ nationalId: string; id: string }> = [],
  students: Array<{ id: string; nationalId?: string }> | undefined = [],
) => {
  const getChildren = jest.fn().mockResolvedValue(children)
  const getStudents = jest.fn().mockResolvedValue(students)

  const service = new PrimarySchoolKeyInfoService(
    { getChildren } as unknown as FriggKeyInfoClientService,
    { getStudents } as unknown as PrimarySchoolClientService,
  )

  return { service, getChildren, getStudents }
}

describe('findChildId', () => {
  it('returns null for a missing national id without asking frigg', async () => {
    const { service, getChildren } = setup([child('0101302989', 'child-1')])

    await expect(service.findChildId(user, null)).resolves.toBeNull()
    await expect(service.findChildId(user, undefined)).resolves.toBeNull()
    await expect(service.findChildId(user, '')).resolves.toBeNull()
    expect(getChildren).not.toHaveBeenCalled()
  })

  it('returns null when no frigg child matches the national id', async () => {
    const { service } = setup([child('0101302989', 'child-1')])

    await expect(service.findChildId(user, '1111111111')).resolves.toBeNull()
  })

  it('returns the frigg child id of the matching child', async () => {
    const { service } = setup([
      child('0101302989', 'child-1'),
      child('1111111111', 'child-2'),
    ])

    await expect(service.findChildId(user, '1111111111')).resolves.toBe(
      'child-2',
    )
  })
})

describe('requireChildIdForStudent', () => {
  it('translates a routed student id into the frigg child id', async () => {
    const { service } = setup(
      [child('0101302989', 'child-1')],
      [student('student-1', '0101302989')],
    )

    await expect(
      service.requireChildIdForStudent(user, 'student-1'),
    ).resolves.toBe('child-1')
  })

  it('throws when the routed student is not in the student list', async () => {
    const { service } = setup(
      [child('0101302989', 'child-1')],
      [student('student-1', '0101302989')],
    )

    await expect(
      service.requireChildIdForStudent(user, 'student-2'),
    ).rejects.toThrow(NotFoundException)
  })

  it('throws when the student list is empty', async () => {
    const { service } = setup([child('0101302989', 'child-1')], undefined)

    await expect(
      service.requireChildIdForStudent(user, 'student-1'),
    ).rejects.toThrow(NotFoundException)
  })

  it('throws when the student carries no national id', async () => {
    const { service, getChildren } = setup(
      [child('0101302989', 'child-1')],
      [student('student-1')],
    )

    await expect(
      service.requireChildIdForStudent(user, 'student-1'),
    ).rejects.toThrow(NotFoundException)
    expect(getChildren).not.toHaveBeenCalled()
  })

  it('throws when the student has no counterpart in frigg', async () => {
    const { service } = setup([], [student('student-1', '0101302989')])

    await expect(
      service.requireChildIdForStudent(user, 'student-1'),
    ).rejects.toThrow(NotFoundException)
  })
})
