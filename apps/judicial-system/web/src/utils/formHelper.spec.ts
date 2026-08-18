import {
  DISTRICT_COURT_RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
  DISTRICT_COURT_RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
  PROSECUTION_INDICTMENT_CASE_CASE_FILES_ROUTE,
  PROSECUTION_INDICTMENT_CASE_POLICE_CASE_FILES_ROUTE,
  PROSECUTION_INDICTMENT_CASE_PROCESSING_ROUTE,
  PROSECUTION_INVESTIGATION_CASE_CASE_FILES_ROUTE,
} from '@island.is/judicial-system/consts'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import { faker } from '@island.is/shared/mocking'

import {
  findFirstInvalidStep,
  hasDateChanged,
  removeErrorMessageIfValid,
  toggleInArray,
  validateAndSendToServer,
} from './formHelper'

describe('removeErrorMessageIfValid', () => {
  const EMPTY = 'Reitur má ekki vera tómur'
  const FORMAT = `Dæmi: R-1234/${new Date().getFullYear()}`

  it('should clear the error message once the value is valid', () => {
    const setErrorMessage = jest.fn()

    removeErrorMessageIfValid(
      ['empty', 'R-case-number'],
      `R-1/${new Date().getFullYear()}`,
      EMPTY,
      setErrorMessage,
    )

    expect(setErrorMessage).toHaveBeenCalledWith('')
  })

  // Regression: an empty-field message used to survive until the value passed
  // every validation, so clearing a required field and starting to retype left
  // "must not be empty" displayed next to a value that was no longer empty.
  it('should clear a stale message when the value fails a different validation', () => {
    const setErrorMessage = jest.fn()

    removeErrorMessageIfValid(
      ['empty', 'R-case-number'],
      'R-',
      EMPTY,
      setErrorMessage,
    )

    expect(setErrorMessage).toHaveBeenCalledWith('')
    // The newly failing rule is not surfaced while typing — that waits for blur.
    expect(setErrorMessage).not.toHaveBeenCalledWith(FORMAT)
  })

  it('should keep the message while the value still breaks the same validation', () => {
    const setErrorMessage = jest.fn()

    removeErrorMessageIfValid(
      ['empty', 'R-case-number'],
      '',
      EMPTY,
      setErrorMessage,
    )

    expect(setErrorMessage).not.toHaveBeenCalled()
  })

  it('should keep a format message while the value still breaks the format rule', () => {
    const setErrorMessage = jest.fn()

    removeErrorMessageIfValid(
      ['empty', 'R-case-number'],
      'R-',
      FORMAT,
      setErrorMessage,
    )

    expect(setErrorMessage).not.toHaveBeenCalled()
  })

  it('should do nothing when no message is displayed', () => {
    const setErrorMessage = jest.fn()

    removeErrorMessageIfValid(['empty'], '', '', setErrorMessage)

    expect(setErrorMessage).not.toHaveBeenCalled()
  })

  it('should do nothing when the caller tracks no message at all', () => {
    const setErrorMessage = jest.fn()

    removeErrorMessageIfValid(['empty'], 'R-', undefined, setErrorMessage)

    expect(setErrorMessage).not.toHaveBeenCalled()
  })
})

describe('toggleInArray', () => {
  it.each`
    values
    ${undefined}
    ${null}
    ${[]}
  `("should return values=['test'] when values=$values", ({ values }) => {
    const item = 'test'

    const res = toggleInArray(values, item)

    expect(res).toEqual([item])
  })

  it.each`
    values
    ${['removeMe']}
    ${['keepMe', 'removeMe']}
    ${['removeMe', 'keepMe']}
    ${['keepMe', 'removeMe', 'keepMe2']}
  `('should remove item if already in values array', ({ values }) => {
    const item = 'removeMe'

    const res = toggleInArray(values, item)

    expect(res.includes(item)).toEqual(false)
  })

  it.each`
    values
    ${['keepMe']}
    ${['keepMe', 'keepMe2']}
    ${['keepMe', 'keepMe2']}
  `('should add item without removing other items', ({ values }) => {
    const item = 'addMe'

    const res = toggleInArray(values, item)

    expect(res.includes(item)).toEqual(true)
  })
})

describe('hasDateChanged', () => {
  it('should return false when dates are equal', () => {
    const currentDate = '2020-10-24T13:37:00Z'
    expect(hasDateChanged(currentDate, new Date('2020-10-24T13:37:00Z'))).toBe(
      false,
    )
  })

  it('should return true when current date is undefined', () => {
    const currentDate = undefined
    expect(hasDateChanged(currentDate, new Date('2020-10-24T13:37:00Z'))).toBe(
      true,
    )
  })

  it('should return true when current date is null', () => {
    const currentDate = null
    expect(hasDateChanged(currentDate, new Date('2020-10-24T13:37:00Z'))).toBe(
      true,
    )
  })

  it('should return if true when dates are not equal', () => {
    const currentDate = '2020-10-24T13:36:00Z'
    expect(hasDateChanged(currentDate, new Date('2020-10-24T13:37:00Z'))).toBe(
      true,
    )
  })
})

describe('findLastValidStep', () => {
  it('should return the last valid step', () => {
    const lastValidStep = findFirstInvalidStep(
      [
        PROSECUTION_INVESTIGATION_CASE_CASE_FILES_ROUTE,
        PROSECUTION_INDICTMENT_CASE_POLICE_CASE_FILES_ROUTE,
        PROSECUTION_INDICTMENT_CASE_PROCESSING_ROUTE,
      ],
      { policeCaseNumbers: ['test'] } as Case,
    )

    expect(lastValidStep).toEqual(PROSECUTION_INDICTMENT_CASE_PROCESSING_ROUTE)
  })

  it('should return the first step if no valid steps are found', () => {
    const lastValidStep = findFirstInvalidStep(
      [
        PROSECUTION_INDICTMENT_CASE_PROCESSING_ROUTE,
        DISTRICT_COURT_RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
        DISTRICT_COURT_RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
      ],
      { policeCaseNumbers: ['test'] } as Case,
    )

    expect(lastValidStep).toEqual(PROSECUTION_INDICTMENT_CASE_PROCESSING_ROUTE)
  })

  it('should return the last step if all steps are valid', () => {
    const lastValidStep = findFirstInvalidStep(
      [
        PROSECUTION_INVESTIGATION_CASE_CASE_FILES_ROUTE,
        PROSECUTION_INDICTMENT_CASE_POLICE_CASE_FILES_ROUTE,
        PROSECUTION_INDICTMENT_CASE_CASE_FILES_ROUTE,
      ],
      { policeCaseNumbers: ['test'] } as Case,
    )

    expect(lastValidStep).toEqual(PROSECUTION_INDICTMENT_CASE_CASE_FILES_ROUTE)
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
    expect(spy).toHaveBeenCalledWith(id, update)
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
