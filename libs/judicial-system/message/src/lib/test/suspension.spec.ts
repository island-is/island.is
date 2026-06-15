import { MessageSuspensionCategory } from '@island.is/judicial-system/types'

import { MessageType } from '../message'
import {
  getMessageSuspensionCategory,
  messageTypeToSuspensionCategory,
} from '../suspension'

describe('message suspension category map', () => {
  const suspendablePrefixes = [
    'DELIVERY_TO_COURT_',
    'DELIVERY_TO_COURT_OF_APPEALS_',
    'DELIVERY_TO_POLICE_',
    'DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_',
  ]

  const isSuspendableType = (type: MessageType) =>
    suspendablePrefixes.some((prefix) => type.startsWith(prefix))

  it('maps every delivery message type to exactly one category', () => {
    Object.values(MessageType)
      .filter(isSuspendableType)
      .forEach((type) => {
        const category = getMessageSuspensionCategory(type)

        expect(category).toBeDefined()
        expect(Object.values(MessageSuspensionCategory)).toContain(category)
      })
  })

  it('does not map non-delivery message types', () => {
    Object.values(MessageType)
      .filter((type) => !isSuspendableType(type))
      .forEach((type) => {
        expect(getMessageSuspensionCategory(type)).toBeUndefined()
      })
  })

  it('separates court of appeals deliveries from court deliveries', () => {
    expect(
      getMessageSuspensionCategory(
        MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE,
      ),
    ).toBe(MessageSuspensionCategory.COURT_OF_APPEALS)
    expect(
      getMessageSuspensionCategory(MessageType.DELIVERY_TO_COURT_CASE_FILE),
    ).toBe(MessageSuspensionCategory.COURT)
  })

  it('only maps to known message types', () => {
    Object.keys(messageTypeToSuspensionCategory).forEach((type) => {
      expect(Object.values(MessageType)).toContain(type)
    })
  })
})
