import { act, render } from '@testing-library/react'
import { Form } from '../components/Form/Form'
import {
  ApplicationProvider,
  useApplicationContext,
} from './ApplicationProvider'

jest.mock('../components/Form/Form', () => ({ Form: jest.fn(() => null) }))
jest.mock('@island.is/localization', () => ({ useNamespaces: jest.fn() }))
jest.mock('@island.is/form-system/ui', () => ({
  applyDependencyVisibility: jest.requireActual(
    '../../../../../libs/portals/form-system/ui-components/src/lib/applyDependencyVisibility',
  ).applyDependencyVisibility,
  SectionTypes: jest.requireActual('@island.is/form-system/enums').SectionTypes,
}))

it('reserves navigation and uploads synchronously before React renders', () => {
  let context!: ReturnType<typeof useApplicationContext>
  jest.mocked(Form).mockImplementation(() => {
    context = useApplicationContext()
    return <></>
  })
  render(
    <ApplicationProvider
      application={{ id: 'application', sections: [] }}
      validateEligibility={false}
      enableApplicationPdfDownload={false}
    />,
  )

  act(() => {
    expect(context.dispatch({ type: 'START_NAVIGATION' })).toBe(true)
    expect(context.dispatch({ type: 'START_FILE_UPLOAD' })).toBe(false)
    expect(context.dispatch({ type: 'START_NAVIGATION' })).toBe(false)
  })
  expect(context.state.isNavigating).toBe(true)
  expect(context.state.pendingUploads ?? 0).toBe(0)

  act(() => {
    context.dispatch({ type: 'FINISH_NAVIGATION' })
    expect(context.dispatch({ type: 'START_FILE_UPLOAD' })).toBe(true)
    expect(context.dispatch({ type: 'START_NAVIGATION' })).toBe(false)
  })
  expect(context.state.pendingUploads).toBe(1)

  act(() => {
    context.dispatch({ type: 'FINISH_FILE_UPLOAD' })
    expect(context.dispatch({ type: 'START_NAVIGATION' })).toBe(true)
  })
  expect(context.state.pendingUploads).toBe(0)
  expect(context.state.isNavigating).toBe(true)
})
