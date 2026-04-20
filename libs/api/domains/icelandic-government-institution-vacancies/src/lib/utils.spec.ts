import { sortVacancyList, VacancyWithCreationDate } from './utils'

describe('sortVacancyList', () => {
  const createVacancy = (
    id: string,
    creationDate?: string,
    publishDate?: string,
  ): VacancyWithCreationDate => ({
    id,
    title: `Vacancy ${id}`,
    applicationDeadlineFrom: publishDate,
    creationDate,
    _creationDate: creationDate ? new Date(creationDate) : undefined,
  })

  it('should sort by creation date descending (newest first)', () => {
    const vacancies = [
      createVacancy('1', '2025-11-01T10:00:00Z', '01.11.2025'),
      createVacancy('2', '2025-11-03T10:00:00Z', '03.11.2025'),
      createVacancy('3', '2025-11-02T10:00:00Z', '02.11.2025'),
    ]

    sortVacancyList(vacancies)

    expect(vacancies.map((v) => v.id)).toEqual(['2', '3', '1'])
  })

  it('should use publish date as secondary sort when creation dates are equal', () => {
    const vacancies = [
      createVacancy('1', '2025-11-01T10:00:00Z', '01.11.2025'),
      createVacancy('2', '2025-11-01T10:00:00Z', '03.11.2025'),
      createVacancy('3', '2025-11-01T10:00:00Z', '02.11.2025'),
    ]

    sortVacancyList(vacancies)

    // Same creation date, so sorted by publish date desc: 3rd Nov, 2nd Nov, 1st Nov
    expect(vacancies.map((v) => v.id)).toEqual(['2', '3', '1'])
  })

  it('should place vacancies with creation dates before those without', () => {
    const vacancies = [
      createVacancy('1', undefined, '01.11.2025'),
      createVacancy('2', '2025-11-03T10:00:00Z', '03.11.2025'),
      createVacancy('3', undefined, '02.11.2025'),
    ]

    sortVacancyList(vacancies)

    // Vacancy 2 has creation date, should come first
    expect(vacancies[0].id).toBe('2')
    // Vacancies without creation dates should be sorted by publish date
    expect(vacancies.slice(1).map((v) => v.id)).toEqual(['3', '1'])
  })

  it('should handle vacancies without publish dates', () => {
    const vacancies = [
      createVacancy('1', '2025-11-01T10:00:00Z', undefined),
      createVacancy('2', '2025-11-03T10:00:00Z', '03.11.2025'),
      createVacancy('3', '2025-11-02T10:00:00Z', undefined),
    ]

    sortVacancyList(vacancies)

    // Should still sort by creation date
    expect(vacancies.map((v) => v.id)).toEqual(['2', '3', '1'])
  })

  it('should handle mixed scenarios', () => {
    const vacancies = [
      createVacancy('1', '2025-11-01T10:00:00Z', '05.11.2025'),
      createVacancy('2', '2025-11-03T10:00:00Z', '01.11.2025'),
      createVacancy('3', '2025-11-02T10:00:00Z', '10.11.2025'),
      createVacancy('4', undefined, '15.11.2025'),
    ]

    sortVacancyList(vacancies)

    // 2, 3, 1 by creation date, then 4 (no creation date) at the end
    expect(vacancies.map((v) => v.id)).toEqual(['2', '3', '1', '4'])
  })

  it('should handle empty array', () => {
    const vacancies: VacancyWithCreationDate[] = []

    expect(() => sortVacancyList(vacancies)).not.toThrow()
    expect(vacancies).toEqual([])
  })

  it('should handle single vacancy', () => {
    const vacancies = [createVacancy('1', '2025-11-01T10:00:00Z', '01.11.2025')]

    sortVacancyList(vacancies)

    expect(vacancies.map((v) => v.id)).toEqual(['1'])
  })

  it('should maintain stable sort when all dates are equal', () => {
    const vacancies = [
      createVacancy('1', '2025-11-01T10:00:00Z', '01.11.2025'),
      createVacancy('2', '2025-11-01T10:00:00Z', '01.11.2025'),
      createVacancy('3', '2025-11-01T10:00:00Z', '01.11.2025'),
    ]

    sortVacancyList(vacancies)

    // Original order should be maintained when all dates equal
    expect(vacancies.map((v) => v.id)).toEqual(['1', '2', '3'])
  })
})
