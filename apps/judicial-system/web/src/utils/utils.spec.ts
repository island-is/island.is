import faker from 'faker'

import {
  Defendant,
  Gender,
  Notification,
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import * as formatters from './formatters'
import {
  getDefaultDefendantGender,
  getShortGender,
  hasSentNotification,
} from './utils'

describe('Utils', () => {
  describe('removeTabs', () => {
    test('should replace a single tab with a single space', () => {
      // Arrange
      const str = '\t'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should replace multiple consecutive tabs with a single space', () => {
      // Arrange
      const str = '\t\t\t'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should remove multiple consecutive tabs with a leading space', () => {
      // Arrange
      const str = ' \t\t\t'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should remove multiple consecutive tabs with a trailing space', () => {
      // Arrange
      const str = '\t\t\t '

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should process a complicated string with tabs', () => {
      // Arrange
      const str =
        'Lorem\t ipsum dolor \t\tsit amet,\t\t\t\tconsectetur \t\t\t adipiscing elit.'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(
        'Lorem ipsum dolor sit amet, consectetur  adipiscing elit.',
      )
    })

    test('should handle undefined', () => {
      // Arrange

      // Act
      const res = formatters.replaceTabs(undefined as unknown as string)

      // Assert
      expect(res).toBeUndefined()
    })

    test('should handle string with no tabs', () => {
      // Arrange
      const str = '020-0202-2929'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual('020-0202-2929')
    })
  })

  describe('getShortGender', () => {
    test('should return short genders given a valid gender', () => {
      // Arrange
      const male = Gender.MALE
      const female = Gender.FEMALE
      const other = Gender.OTHER

      // Act
      const resultM = getShortGender(male)
      const resultF = getShortGender(female)
      const resultO = getShortGender(other)

      // Assert
      expect(resultM).toEqual('kk')
      expect(resultF).toEqual('kvk')
      expect(resultO).toEqual('annað')
    })

    test('should return an empty string when not given a gender', () => {
      // Arrange
      const str = undefined

      // Act
      const res = getShortGender(str)

      // Assert
      expect(res).toEqual('')
    })
  })

  describe('hasSentNotification', () => {
    test('should return false if notifications are not provided', () => {
      // Arrange
      const n1 = undefined
      const n2: Notification[] = []
      const nt = NotificationType.COURT_DATE

      // Act
      const res1 = hasSentNotification(nt, n1).hasSent
      const res2 = hasSentNotification(nt, n2).hasSent

      // Assert
      expect(res1).toEqual(false)
      expect(res2).toEqual(false)
    })

    test('should return false if a notification has been sent in the past but the last time it was sent it failed', () => {
      // Arrange
      const email = faker.internet.email()
      const n: Notification[] = [
        {
          id: faker.datatype.uuid(),
          created: faker.date.future().toISOString(),
          caseId: faker.datatype.uuid(),
          type: NotificationType.COURT_DATE,
          recipients: [
            {
              success: false,
              address: email,
            },
          ],
        },
        {
          id: faker.datatype.uuid(),
          created: faker.date.past().toISOString(),
          caseId: faker.datatype.uuid(),
          type: NotificationType.COURT_DATE,
          recipients: [
            {
              success: true,
              address: email,
            },
          ],
        },
      ]
      const nt = NotificationType.COURT_DATE

      // Act
      const res = hasSentNotification(nt, n).hasSent

      // Assert
      expect(res).toEqual(false)
    })

    test('should return false if no notification is found of a specific notification type', () => {
      // Arrange
      const email = faker.internet.email()
      const n: Notification[] = [
        {
          id: faker.datatype.uuid(),
          created: faker.date.future().toISOString(),
          caseId: faker.datatype.uuid(),
          type: NotificationType.COURT_DATE,
          recipients: [
            {
              success: true,
              address: email,
            },
          ],
        },
      ]
      const nt = NotificationType.REVOKED

      // Act
      const res = hasSentNotification(nt, n).hasSent

      // Assert
      expect(res).toEqual(false)
    })

    test('should return true if the latest notification has been sent successfully', () => {
      // Arrange
      const email = faker.internet.email()
      const n: Notification[] = [
        {
          id: faker.datatype.uuid(),
          created: faker.date.future().toISOString(),
          caseId: faker.datatype.uuid(),
          type: NotificationType.COURT_DATE,
          recipients: [
            {
              success: true,
              address: email,
            },
          ],
        },
        {
          id: faker.datatype.uuid(),
          created: faker.date.past().toISOString(),
          caseId: faker.datatype.uuid(),
          type: NotificationType.COURT_DATE,
          recipients: [
            {
              success: true,
              address: email,
            },
          ],
        },
      ]
      const nt = NotificationType.COURT_DATE

      // Act
      const res = hasSentNotification(nt, n).hasSent

      // Assert
      expect(res).toEqual(true)
    })
  })

  describe('getDefaultDefendantGender', () => {
    test('should return MALE for a sole male defendant', () => {
      // Arrange
      const defendants = [{ gender: Gender.MALE } as Defendant]

      // Act
      const gender = getDefaultDefendantGender(defendants)

      // Assert
      expect(gender).toBe(Gender.MALE)
    })
  })

  describe('getDefaultDefendantGender', () => {
    test('should return FEMALE for a sole female defendant', () => {
      // Arrange
      const defendants = [{ gender: Gender.FEMALE } as Defendant]

      // Act
      const gender = getDefaultDefendantGender(defendants)

      // Assert
      expect(gender).toBe(Gender.FEMALE)
    })
  })

  describe('getDefaultDefendantGender', () => {
    test('should return OTHER for a sole defendant with other gender', () => {
      // Arrange
      const defendants = [{ gender: Gender.OTHER } as Defendant]

      // Act
      const gender = getDefaultDefendantGender(defendants)

      // Assert
      expect(gender).toBe(Gender.OTHER)
    })
  })

  describe('getDefaultDefendantGender', () => {
    test('should return MALE for a sole defendant with undefined gender', () => {
      // Arrange
      const defendants = [{} as Defendant]

      // Act
      const gender = getDefaultDefendantGender(defendants)

      // Assert
      expect(gender).toBe(Gender.MALE)
    })
  })

  describe('getDefaultDefendantGender', () => {
    test('should return MALE for no defendant', () => {
      // Arrange
      const defendants: Defendant[] = []

      // Act
      const gender = getDefaultDefendantGender(defendants)

      // Assert
      expect(gender).toBe(Gender.MALE)
    })
  })

  describe('getDefaultDefendantGender', () => {
    test('should return MALE for undefined defendants', () => {
      // Arrange
      const defendants = undefined

      // Act
      const gender = getDefaultDefendantGender(defendants)

      // Assert
      expect(gender).toBe(Gender.MALE)
    })
  })

  describe('getDefaultDefendantGender', () => {
    test('should return MALE for multiple defendants', () => {
      // Arrange
      const defendants = [
        { gender: Gender.FEMALE } as Defendant,
        { gender: Gender.OTHER } as Defendant,
        { gender: Gender.MALE } as Defendant,
      ]

      // Act
      const gender = getDefaultDefendantGender(defendants)

      // Assert
      expect(gender).toBe(Gender.MALE)
    })
  })
})
