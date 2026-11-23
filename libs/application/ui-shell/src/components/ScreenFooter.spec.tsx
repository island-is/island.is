import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import { z } from 'zod'

import { ApolloProvider } from '@apollo/client'
import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { client } from '@island.is/application/graphql'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  Form,
  FormModes,
} from '@island.is/application/types'
import { applicationSystemScopes } from '@island.is/auth/scopes'
import { LocaleProvider } from '@island.is/localization'
import { BffProvider, createMockedInitialState } from '@island.is/react-spa/bff'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { FormShell } from '../lib/FormShell'
import { isScreenFooterVisible } from './ScreenFooter'
import * as styles from './ScreenFooter.css'

const mockedInitialState = createMockedInitialState({
  scopes: applicationSystemScopes,
})

let intersectionCallback: IntersectionObserverCallback | undefined

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback
  }
  observe = jest.fn()
  disconnect = jest.fn()
  unobserve = jest.fn()
  takeRecords = jest.fn()
}

const triggerIntersection = (isBelowViewport: boolean) =>
  act(async () => {
    intersectionCallback?.(
      [
        {
          isIntersecting: !isBelowViewport,
          boundingClientRect: { top: isBelowViewport ? 2000 : 400 },
          rootBounds: { bottom: 800 },
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    )
  })

const applicant = '1111112219'
const application: Application = {
  id: '12315151515',
  assignees: [],
  typeId: ApplicationTypes.PARENTAL_LEAVE,
  externalData: {},
  answers: {},
  applicant,
  state: 'draft',
  modified: new Date(),
  created: new Date(),
  status: ApplicationStatus.IN_PROGRESS,
  applicantActors: [],
}

type SubmitOptions = {
  stickyFooter?: boolean
  placement?: 'footer' | 'screen'
}

const buildTestForm = ({ stickyFooter, placement }: SubmitOptions): Form =>
  buildForm({
    id: 'OverviewForm',
    title: 'Overview form',
    mode: FormModes.DRAFT,
    children: [
      buildMultiField({
        id: 'overview',
        title: 'Yfirlit',
        children: [
          buildDescriptionField({
            id: 'overview.description',
            title: 'Long overview content',
          }),
          buildSubmitField({
            id: 'submit',
            title: 'Staðfesta',
            stickyFooter,
            placement,
            actions: [
              { event: 'SUBMIT', name: 'Senda umsókn', type: 'primary' },
            ],
          }),
        ],
      }),
      buildDescriptionField({ id: 'done', title: 'Takk fyrir' }),
    ],
  })

const renderForm = async (options: SubmitOptions = {}) => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <FormShell
            application={application}
            dataSchema={z.object({})}
            form={buildTestForm(options)}
            nationalRegistryId={applicant}
          />
        ),
      },
    ],
    { initialEntries: ['/'] },
  )

  await act(async () => {
    render(
      <ApolloProvider client={client}>
        <LocaleProvider locale="is" messages={{}}>
          <BffProvider
            applicationBasePath="/umsoknir"
            mockedInitialState={mockedInitialState}
          >
            <RouterProvider router={router} />
          </BffProvider>
        </LocaleProvider>
      </ApolloProvider>,
    )
  })

  await screen.findByText('Senda umsókn')
}

describe('ScreenFooter', () => {
  const originalIntersectionObserver = window.IntersectionObserver

  beforeEach(() => {
    intersectionCallback = undefined
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver
    window.scrollTo = jest.fn()
  })

  afterEach(() => {
    window.IntersectionObserver = originalIntersectionObserver
  })

  describe('isScreenFooterVisible', () => {
    it('hides the footer on the last screen unless a button should be rendered', () => {
      const base = {
        activeScreenIndex: 1,
        numberOfScreens: 2,
        mode: FormModes.DRAFT,
      }
      expect(isScreenFooterVisible(base)).toBe(false)
      expect(
        isScreenFooterVisible({ ...base, renderLastScreenButton: true }),
      ).toBe(true)
    })

    it('hides the footer outside of editable modes', () => {
      expect(
        isScreenFooterVisible({
          activeScreenIndex: 0,
          numberOfScreens: 2,
          mode: FormModes.COMPLETED,
        }),
      ).toBe(false)
    })
  })

  it('makes the footer sticky by default when the submit actions are in the footer', async () => {
    await renderForm()

    expect(screen.getByTestId('screen-footer')).toHaveClass(styles.sticky)
    expect(intersectionCallback).toBeDefined()
  })

  it('only adds the shadow while there is more content below the footer', async () => {
    await renderForm()

    await triggerIntersection(false)
    expect(screen.getByTestId('screen-footer')).not.toHaveClass(styles.stuck)

    await triggerIntersection(true)
    expect(screen.getByTestId('screen-footer')).toHaveClass(styles.stuck)

    await triggerIntersection(false)
    expect(screen.getByTestId('screen-footer')).not.toHaveClass(styles.stuck)
  })

  it('does not make the footer sticky when opted out', async () => {
    await renderForm({ stickyFooter: false })

    expect(screen.getByTestId('screen-footer')).not.toHaveClass(styles.sticky)
    expect(intersectionCallback).toBeUndefined()
  })

  it('does not make the footer sticky when the submit actions are on the screen', async () => {
    await renderForm({ placement: 'screen' })

    expect(screen.getByTestId('screen-footer')).not.toHaveClass(styles.sticky)
    expect(intersectionCallback).toBeUndefined()
  })
})
