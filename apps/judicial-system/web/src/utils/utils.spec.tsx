import React from 'react'
import faker from 'faker'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Notification,
  NotificationType,
} from '@island.is/judicial-system/types'

import { Gender } from '../graphql/schema'
import * as formatters from './formatters'
import {
  getAppealEndDate,
  getShortGender,
  hasSentNotification,
} from './stepHelper'

describe('Formatters utils', () => {
  describe('Parse time', () => {
    test('should return a valid date with time given a valid date and time', () => {
      // Arrange
      const date = '2020-10-24T12:25:00Z'
      const time = '13:37'

      // Act
      const d = formatters.parseTime(date, time)

      // Assert
      expect(d).toEqual('2020-10-24T13:37:00Z')
    })

    test('should return the date given a valid date and an invalid time', () => {
      // Arrange
      const date = '2020-10-24T12:25:00Z'
      const time = '99:00'
      const time2 = ''

      // Act
      const d = formatters.parseTime(date, time)
      const dd = formatters.parseTime(date, time2)

      // Assert
      expect(d).toEqual('2020-10-24')
      expect(dd).toEqual('2020-10-24')
    })
  })

  describe('padTimeWithZero', () => {
    test('should pad a time with single hour value with a zero', () => {
      // Arrange
      const val = '1:15'

      // Act
      const result = formatters.padTimeWithZero(val)

      // Assert
      expect(result).toEqual('01:15')
    })

    test('should return the input value if the value is of lenght 5', () => {
      // Arrange
      const val = '01:15'

      // Act
      const result = formatters.padTimeWithZero(val)

      // Assert
      expect(result).toEqual('01:15')
    })
  })

  describe('replaceTabsOnChange', () => {
    test('should not call replaceTabs if called with a string that does not have a tab character', async () => {
      // Arrange
      const user = userEvent.setup()
      const spy = jest.spyOn(formatters, 'replaceTabs')
      render(<input onChange={(evt) => formatters.replaceTabsOnChange(evt)} />)

      // Act
      await user.type(await screen.findByRole('textbox'), 'Lorem ipsum')

      // Assert
      expect(spy).not.toBeCalled()
    })
  })

  describe('enumerate', () => {
    test('should enumerate list with three values', () => {
      // Arrange
      const values = ['alice', 'bob', 'paul']
      const endWord = 'and'

      // Act
      const result = formatters.enumerate(values, endWord)

      //Assert
      expect(result).toBe('alice, bob and paul')
    })

    test('should enumerate list with two values', () => {
      // Arrange
      const values = ['alice', 'bob']
      const endWord = 'or'

      // Act
      const result = formatters.enumerate(values, endWord)

      //Assert
      expect(result).toBe('alice or bob')
    })

    test('should enumerate list with one value', () => {
      // Arrange
      const values = ['alice']
      const endWord = 'and'

      // Act
      const result = formatters.enumerate(values, endWord)

      //Assert
      expect(result).toBe('alice')
    })

    test('should handle empty list', () => {
      // Arrange
      const values: string[] = []
      const endWord = 'and'

      // Act
      const result = formatters.enumerate(values, endWord)

      //Assert
      expect(result).toBe('')
    })
  })
})

describe('Step helper', () => {
  describe('insertAt', () => {
    test('should insert a string at a certain position into another string', () => {
      // Arrange
      const str = 'Lorem ipsum dolum kara'
      const insertion = ' lara'

      // Act
      const result = formatters.insertAt(str, insertion, 5)

      // Assert
      expect(result).toEqual('Lorem lara ipsum dolum kara')
    })
  })

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

  describe('getAppealEndDate', () => {
    test('should return the correct end date', () => {
      // Arrange
      const date = '2020-10-24T12:25:00Z'

      // Act
      const result = getAppealEndDate(date)

      // Assert
      expect(result).toEqual('27. október 2020 kl. 12:25')
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
      const res1 = hasSentNotification(nt, n1)
      const res2 = hasSentNotification(nt, n2)

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
      const res = hasSentNotification(nt, n)

      // Assert
      expect(res).toEqual(false)
    })
  })

  test('should return false if no notification is found of a spesific notification type', () => {
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
    const res = hasSentNotification(nt, n)

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
    const res = hasSentNotification(nt, n)

    // Assert
    expect(res).toEqual(true)
  })
})
