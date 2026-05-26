import { CrimeSceneMap } from './case'
import {
  getIndictmentCountDisplayOrderUpdates,
  sortIndictmentCounts,
} from './indictmentCount'

const count = (id: string, displayOrder: number, policeCaseNumber?: string) => ({
  id,
  displayOrder,
  policeCaseNumber,
  created: '2024-01-01T00:00:00Z',
})

describe('sortIndictmentCounts', () => {
  it('sorts by displayOrder ascending', () => {
    const counts = [count('b', 2), count('a', 0), count('c', 1)]
    expect(sortIndictmentCounts(counts).map((c) => c.id)).toEqual(['a', 'c', 'b'])
  })

  it('tie-breaks equal displayOrder by created', () => {
    const counts = [
      { id: 'b', displayOrder: 0, created: '2024-02-01T00:00:00Z' },
      { id: 'a', displayOrder: 0, created: '2024-01-01T00:00:00Z' },
    ]
    expect(sortIndictmentCounts(counts).map((c) => c.id)).toEqual(['a', 'b'])
  })
})

describe('getIndictmentCountDisplayOrderUpdates', () => {
  it('assigns indices from chronological compare', () => {
    const crimeScenes: CrimeSceneMap = {
      p1: { date: new Date('2024-03-01') },
      p2: { date: new Date('2024-01-01') },
    }
    const counts = [count('a', 0, 'p1'), count('b', 0, 'p2')]
    const updates = getIndictmentCountDisplayOrderUpdates(counts, crimeScenes)
    expect(updates).toEqual([
      { id: 'b', displayOrder: 0 },
      { id: 'a', displayOrder: 1 },
    ])
  })
})
