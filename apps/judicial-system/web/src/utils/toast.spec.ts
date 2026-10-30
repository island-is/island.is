// eslint-disable-next-line no-restricted-imports
import { toast as uiToast } from '@island.is/island-ui/core'

import { toast } from './toast'

describe('toast', () => {
  let consoleError: jest.SpyInstance
  let uiToastError: jest.SpyInstance
  let uiToastSuccess: jest.SpyInstance

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation()
    uiToastError = jest.spyOn(uiToast, 'error').mockImplementation()
    uiToastSuccess = jest.spyOn(uiToast, 'success').mockImplementation()
  })

  afterEach(() => {
    consoleError.mockRestore()
    uiToastError.mockRestore()
    uiToastSuccess.mockRestore()
  })

  test('should log and show an error toast', () => {
    toast.error('Upp kom villa', { autoClose: 1000 })

    expect(consoleError).toHaveBeenCalledWith(
      'User-facing error: Upp kom villa',
    )
    expect(uiToastError).toHaveBeenCalledWith('Upp kom villa', {
      autoClose: 1000,
    })
  })

  test('should log the log message instead of the toast message when given', () => {
    toast.error('Ákærði: Jón Jónsson er ekki með kennitölu', {
      logMessage: 'Defendant has no national id',
    })

    expect(consoleError).toHaveBeenCalledWith(
      'User-facing error: Defendant has no national id',
    )
    expect(uiToastError).toHaveBeenCalledWith(
      'Ákærði: Jón Jónsson er ekki með kennitölu',
      {},
    )
  })

  test('should not log non-error toasts', () => {
    toast.success('Dómur skráður')

    expect(consoleError).not.toHaveBeenCalled()
    expect(uiToastSuccess).toHaveBeenCalledWith('Dómur skráður', undefined)
  })
})
