import faker from 'faker'

import type { TagVariant } from '@island.is/island-ui/core'

export type MockBulkCase = {
  id: string
  caseNumbers: string[]
  defendantName: string
  defendantDetail?: string
  caseType: string
  caseTypeExtra?: string
  judgmentDate: string
  judgmentTime: string
  statusText: string
  statusColor: TagVariant
  judgeInitials?: string
  /** Eligible to move into the staging list when selection mode is on */
  canComplete: boolean
  /** Shown as a warning in the confirm modal when selected */
  judgmentNotStarted: boolean
}

export const MOCK_CASES: MockBulkCase[] = [
  {
    id: 'case-123',
    caseNumbers: ['HDR: S-123/2026', '007-2022-123'],
    defendantName: faker.name.findName(),
    defendantDetail: 'kt. 121200-1212',
    caseType: 'Fjársvik',
    judgmentDate: '21.11.2026',
    judgmentTime: 'kl. 14:00',
    statusText: 'Dómur staðfestur',
    statusColor: 'mint',
    canComplete: true,
    judgmentNotStarted: false,
  },
  {
    id: 'case-241',
    caseNumbers: ['241/2026', 'HDRN: S-301/2026', '007-2026-45678'],
    defendantName: faker.name.findName(),
    defendantDetail: 'kt. 123456-7890',
    caseType: 'Umferðarlagabrot',
    caseTypeExtra: '+1',
    judgmentDate: '21.11.2026',
    judgmentTime: 'kl. 14:00',
    statusText: 'Bíður staðfestingar',
    statusColor: 'blue',
    judgeInitials: 'AEJ',
    canComplete: false,
    judgmentNotStarted: false,
  },
  {
    id: 'case-238',
    caseNumbers: ['238/2026', 'HDR: S-288/2026', '007-2026-33445'],
    defendantName: faker.name.findName(),
    defendantDetail: '+ 2',
    caseType: 'Líkamsárás',
    judgmentDate: '21.11.2026',
    judgmentTime: 'kl. 15:00',
    statusText: 'Úrskurður staðfestur',
    statusColor: 'blueberry',
    judgeInitials: 'SS',
    canComplete: true,
    judgmentNotStarted: true,
  },
]
