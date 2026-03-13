import { getAssigneesNationalIdList } from './getAssigneesNationalIdList'
import { Application } from '@island.is/application/types'
import { createApplication } from '@island.is/application/testing'
import { ApplicationTypes } from '@island.is/application/types'

describe('getAssigneesNationalIdList', () => {
  it('should return enabled heirs who have not approved', () => {
    const application = createApplication({
      typeId: ApplicationTypes.INHERITANCE_REPORT,
      applicant: '0101301234',
      answers: {
        heirs: {
          data: [
            {
              name: 'Heir A',
              nationalId: '0101302209',
              enabled: true,
              approved: false,
            },
            {
              name: 'Heir B',
              nationalId: '0101302399',
              enabled: true,
            },
          ],
        },
      },
    }) as Application

    const result = getAssigneesNationalIdList(application)
    expect(result).toEqual(['0101302209', '0101302399'])
  })

  it('should filter out disabled heirs', () => {
    const application = createApplication({
      typeId: ApplicationTypes.INHERITANCE_REPORT,
      applicant: '0101301234',
      answers: {
        heirs: {
          data: [
            {
              name: 'Heir A',
              nationalId: '0101302209',
              enabled: true,
            },
            {
              name: 'Heir B (disabled)',
              nationalId: '0101302399',
              enabled: false,
            },
            {
              name: 'Heir C',
              nationalId: '0101302499',
              enabled: true,
            },
          ],
        },
      },
    }) as Application

    const result = getAssigneesNationalIdList(application)
    expect(result).toEqual(['0101302209', '0101302499'])
  })

  it('should filter out heirs who have already approved', () => {
    const application = createApplication({
      typeId: ApplicationTypes.INHERITANCE_REPORT,
      applicant: '0101301234',
      answers: {
        heirs: {
          data: [
            {
              name: 'Heir A (approved)',
              nationalId: '0101302209',
              enabled: true,
              approved: true,
            },
            {
              name: 'Heir B',
              nationalId: '0101302399',
              enabled: true,
              approved: false,
            },
            {
              name: 'Heir C',
              nationalId: '0101302499',
              enabled: true,
            },
          ],
        },
      },
    }) as Application

    const result = getAssigneesNationalIdList(application)
    expect(result).toEqual(['0101302399', '0101302499'])
  })

  it('should filter out the applicant if they are also a heir', () => {
    const application = createApplication({
      typeId: ApplicationTypes.INHERITANCE_REPORT,
      applicant: '0101302209',
      answers: {
        heirs: {
          data: [
            {
              name: 'Applicant (also heir)',
              nationalId: '0101302209',
              enabled: true,
            },
            {
              name: 'Heir B',
              nationalId: '0101302399',
              enabled: true,
            },
          ],
        },
      },
    }) as Application

    const result = getAssigneesNationalIdList(application)
    expect(result).toEqual(['0101302399'])
  })

  it('should filter out applicant with different format (hyphenated)', () => {
    const application = createApplication({
      typeId: ApplicationTypes.INHERITANCE_REPORT,
      applicant: '010130-2209',
      answers: {
        heirs: {
          data: [
            {
              name: 'Applicant (also heir)',
              nationalId: '0101302209',
              enabled: true,
            },
            {
              name: 'Heir B',
              nationalId: '0101302399',
              enabled: true,
            },
          ],
        },
      },
    }) as Application

    const result = getAssigneesNationalIdList(application)
    expect(result).toEqual(['0101302399'])
  })

  it('should return empty array when no heirs exist', () => {
    const application = createApplication({
      typeId: ApplicationTypes.INHERITANCE_REPORT,
      applicant: '0101301234',
      answers: {
        heirs: {
          data: [],
        },
      },
    }) as Application

    const result = getAssigneesNationalIdList(application)
    expect(result).toEqual([])
  })

  it('should return empty array when heirs data is undefined', () => {
    const application = createApplication({
      typeId: ApplicationTypes.INHERITANCE_REPORT,
      applicant: '0101301234',
      answers: {
        heirs: {},
      },
    }) as Application

    const result = getAssigneesNationalIdList(application)
    expect(result).toEqual([])
  })

  it('should filter out heirs without nationalId', () => {
    const application = createApplication({
      typeId: ApplicationTypes.INHERITANCE_REPORT,
      applicant: '0101301234',
      answers: {
        heirs: {
          data: [
            {
              name: 'Heir A (no ID)',
              enabled: true,
            },
            {
              name: 'Heir B',
              nationalId: '0101302399',
              enabled: true,
            },
          ],
        },
      },
    }) as Application

    const result = getAssigneesNationalIdList(application)
    expect(result).toEqual(['0101302399'])
  })

  it('should handle complex filtering scenario', () => {
    const application = createApplication({
      typeId: ApplicationTypes.INHERITANCE_REPORT,
      applicant: '0101301234',
      answers: {
        heirs: {
          data: [
            {
              name: 'Heir A (approved)',
              nationalId: '0101302209',
              enabled: true,
              approved: true,
            },
            {
              name: 'Heir B',
              nationalId: '0101302399',
              enabled: true,
            },
            {
              name: 'Heir C (disabled)',
              nationalId: '0101302499',
              enabled: false,
            },
            {
              name: 'Applicant (also heir)',
              nationalId: '0101301234',
              enabled: true,
            },
            {
              name: 'Heir D (no ID)',
              enabled: true,
            },
            {
              name: 'Heir E',
              nationalId: '0101302599',
              enabled: true,
              approved: false,
            },
          ],
        },
      },
    }) as Application

    const result = getAssigneesNationalIdList(application)
    expect(result).toEqual(['0101302399', '0101302599'])
  })
})

