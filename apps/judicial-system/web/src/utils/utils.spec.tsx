import faker from 'faker'

import {
  Case,
  Gender,
  Notification,
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import * as formatters from './formatters'
import { validateAndSendToServer } from './formHelper'
import { getShortGender, hasSentNotification } from './utils'

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

  describe('validateAndSendToServer', () => {
    test('should call the updateCase function with the correct parameters', () => {
      // Arrange
      const spy = jest.fn()
      const fieldToUpdate = 'courtCaseNumber'
      const value = '1234/1234'
      const id = faker.datatype.uuid()
      const theCase = { id } as Case
      const update = {
        courtCaseNumber: value,
      }

      // Act
      validateAndSendToServer(
        fieldToUpdate,
        value,
        ['appeal-case-number-format'],
        theCase,
        spy,
      )

      // Assert
      expect(spy).toBeCalledWith(id, update)
    })

    test('should not call the updateCase function if the value is invalid', () => {
      // Arrange
      const spy = jest.fn()
      const fieldToUpdate = 'courtCaseNumber'
      const value = '12341234'
      const id = faker.datatype.uuid()
      const theCase = { id } as Case

      // Act
      validateAndSendToServer(
        fieldToUpdate,
        value,
        ['appeal-case-number-format'],
        theCase,
        spy,
      )

      // Assert
      expect(spy).not.toHaveBeenCalled()
    })
  })
})
