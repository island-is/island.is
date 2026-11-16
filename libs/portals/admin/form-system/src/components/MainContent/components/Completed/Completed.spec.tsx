import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import {
  GET_ORGANIZATION_LOGO,
  UPDATE_ORGANIZATION_LOGO,
} from '@island.is/form-system/graphql'
import { toast } from '@island.is/island-ui/core'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { InputHTMLAttributes, ReactNode } from 'react'
import {
  ControlContext,
  IControlContext,
} from '../../../../context/ControlContext'
import { Completed } from './Completed'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    formatMessage: (message?: { defaultMessage: string }) =>
      message?.defaultMessage ?? '',
  }),
}))
jest.mock('@island.is/form-system/ui', () => ({
  m: { enableApplicationPdfDownload: { defaultMessage: 'Download PDF' } },
}))
jest.mock('./components/AdditionalInfo', () => ({
  AdditionalInfo: () => null,
}))
jest.mock('@island.is/island-ui/core', () => {
  const Container = ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  )
  return {
    Box: Container,
    Stack: Container,
    Text: Container,
    GridRow: Container,
    Button: Container,
    Input: () => null,
    Divider: () => null,
    AlertMessage: () => null,
    toast: { error: jest.fn() },
    Checkbox: ({
      label,
      checked,
      disabled,
      onChange,
    }: InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
      <label>
        {label}
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
        />
      </label>
    ),
  }
})

const organizationNationalId = '1234567890'
const request = {
  query: GET_ORGANIZATION_LOGO,
  variables: { input: { nationalId: organizationNationalId } },
}

const renderCompleted = (
  mocks: MockedResponse[],
  checked = false,
  nationalId: string | null = organizationNationalId,
) => {
  const controlDispatch = jest.fn<IControlContext['controlDispatch']>()
  const formUpdate = jest.fn<IControlContext['formUpdate']>()
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ControlContext.Consumer>
        {(context) => (
          <ControlContext.Provider
            value={{
              ...context,
              control: {
                ...context.control,
                form: {
                  id: 'form',
                  name: { is: '' },
                  status: 'IN_DEVELOPMENT',
                  created: '2026-01-01T00:00:00Z',
                  modified: '2026-01-01T00:00:00Z',
                  allowProceedOnValidationFail: false,
                  draftDaysToLive: 0,
                  enableApplicationPdfDownload: checked,
                  hasSummaryScreen: false,
                  isInaccessible: false,
                  isTranslated: false,
                  submissionDaysToLive: 0,
                  validateEligibility: false,
                },
                organizationNationalId: nationalId,
                isReadOnly: false,
              },
              controlDispatch,
              formUpdate,
            }}
          >
            <Completed />
          </ControlContext.Provider>
        )}
      </ControlContext.Consumer>
    </MockedProvider>,
  )
  return { controlDispatch, formUpdate }
}

describe('Completed organization logo', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('fetches and saves the Contentful logo URL when PDF downloads are enabled', async () => {
    const logo = 'https://images.ctfassets.net/space/logo/organization.png'
    const result = jest.fn(() => ({
      data: { getOrganizationByNationalId: { logo: { url: logo } } },
    }))
    const save = jest.fn(() => ({
      data: { updateFormSystemOrganizationLogo: true },
    }))
    const { controlDispatch, formUpdate } = renderCompleted([
      { request, result },
      {
        request: {
          query: UPDATE_ORGANIZATION_LOGO,
          variables: { input: { nationalId: organizationNationalId, logo } },
        },
        result: save,
      },
    ])

    expect(result).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Download PDF' }))

    expect(controlDispatch).toHaveBeenCalledWith({
      type: 'CHANGE_ENABLE_APPLICATION_PDF_DOWNLOAD',
      payload: { value: true, update: formUpdate },
    })
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1))
    expect(result).toHaveBeenCalledTimes(1)
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('retries a missing organization with a dashed national ID and saves its logo', async () => {
    const logo = 'https://images.ctfassets.net/space/logo/organization.png'
    const save = jest.fn(() => ({
      data: { updateFormSystemOrganizationLogo: true },
    }))
    const fallback = jest.fn(() => ({
      data: { getOrganizationByNationalId: { logo: { url: logo } } },
    }))
    renderCompleted([
      { request, result: { data: { getOrganizationByNationalId: null } } },
      {
        request: {
          query: GET_ORGANIZATION_LOGO,
          variables: { input: { nationalId: '123456-7890' } },
        },
        result: fallback,
      },
      {
        request: {
          query: UPDATE_ORGANIZATION_LOGO,
          variables: { input: { nationalId: organizationNationalId, logo } },
        },
        result: save,
      },
    ])

    fireEvent.click(screen.getByRole('checkbox', { name: 'Download PDF' }))

    await waitFor(() => expect(save).toHaveBeenCalledTimes(1))
    expect(fallback).toHaveBeenCalledTimes(1)
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('does not fetch a logo when PDF downloads are disabled', () => {
    const result = jest.fn(() => ({
      data: { getOrganizationByNationalId: null },
    }))
    const { controlDispatch, formUpdate } = renderCompleted(
      [{ request, result }],
      true,
    )

    fireEvent.click(screen.getByRole('checkbox', { name: 'Download PDF' }))

    expect(controlDispatch).toHaveBeenCalledWith({
      type: 'CHANGE_ENABLE_APPLICATION_PDF_DOWNLOAD',
      payload: { value: false, update: formUpdate },
    })
    expect(result).not.toHaveBeenCalled()
  })

  it('clears the stored logo when Contentful no longer has a logo', async () => {
    const save = jest.fn(() => ({
      data: { updateFormSystemOrganizationLogo: true },
    }))
    renderCompleted([
      {
        request,
        result: { data: { getOrganizationByNationalId: { logo: null } } },
      },
      {
        request: {
          query: UPDATE_ORGANIZATION_LOGO,
          variables: {
            input: { nationalId: organizationNationalId, logo: '' },
          },
        },
        result: save,
      },
    ])

    fireEvent.click(screen.getByRole('checkbox', { name: 'Download PDF' }))

    await waitFor(() => expect(save).toHaveBeenCalledTimes(1))
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('reports logo fetch failures', async () => {
    const save = jest.fn(() => ({
      data: { updateFormSystemOrganizationLogo: true },
    }))
    renderCompleted([
      { request, error: new Error('Contentful unavailable') },
      {
        request: {
          query: UPDATE_ORGANIZATION_LOGO,
          variables: {
            input: { nationalId: organizationNationalId, logo: '' },
          },
        },
        result: save,
      },
    ])

    fireEvent.click(screen.getByRole('checkbox', { name: 'Download PDF' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1))
    expect(save).not.toHaveBeenCalled()
  })

  it('reports a missing organization national ID without fetching a logo', () => {
    renderCompleted([], false, null)

    fireEvent.click(screen.getByRole('checkbox', { name: 'Download PDF' }))

    expect(toast.error).toHaveBeenCalledTimes(1)
  })

  it('reports logo persistence failures', async () => {
    const logo = 'https://images.ctfassets.net/space/logo/organization.png'
    renderCompleted([
      {
        request,
        result: {
          data: { getOrganizationByNationalId: { logo: { url: logo } } },
        },
      },
      {
        request: {
          query: UPDATE_ORGANIZATION_LOGO,
          variables: { input: { nationalId: organizationNationalId, logo } },
        },
        error: new Error('Organization update failed'),
      },
    ])

    fireEvent.click(screen.getByRole('checkbox', { name: 'Download PDF' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1))
  })
})
