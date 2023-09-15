import { hasReachedAge } from './ageUtil'
import { generatePerson } from 'kennitala'

describe('HasReachedAge', () => {
  const nationalId = generatePerson(new Date(2000, 0, 2))

  it('should return true if person is older than limit', () => {
    const res = hasReachedAge(nationalId, new Date(2020, 0, 1), 18)
    expect(res).toBeTruthy()
  })

  it('should return false if person is to young', () => {
    const res = hasReachedAge(nationalId, new Date(2020, 0, 1), 35)
    expect(res).toBeFalsy()
  })

  it('should return false if person reaches limit tomorrow', () => {
    const res = hasReachedAge(nationalId, new Date(2020, 0, 3), 20)
    expect(res).toBeFalsy()
  })

  it('should return true if person reached the limit yesterday', () => {
    const res = hasReachedAge(nationalId, new Date(2020, 0, 1), 20)
    expect(res).toBeTruthy()
  })

  it('should return true if person reached limit today', () => {
    const res = hasReachedAge(nationalId, new Date(2020, 0, 2), 20)
    expect(res).toBeTruthy()
  })
})
