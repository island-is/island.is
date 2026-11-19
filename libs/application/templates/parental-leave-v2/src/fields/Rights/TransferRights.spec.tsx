import React, { useEffect } from 'react'
import { act, render } from '@testing-library/react'
import { FormProvider, UseFormReturn, useForm } from 'react-hook-form'

import { Application, CustomField } from '@island.is/application/types'

import { TransferRightsOption } from '../../constants'
import { TransferRights } from './TransferRights'

type RadioProps = {
  field: { defaultValue?: string; onSelect: (value: string) => void }
}

const mockRadioRenders: RadioProps[] = []

jest.mock('@island.is/application/ui-fields', () => ({
  RadioFormField: (props: RadioProps) => {
    mockRadioRenders.push(props)
    return null
  },
}))

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ formatMessage: () => '' }),
}))

const lastRadio = () => mockRadioRenders[mockRadioRenders.length - 1]

const renderTransferRights = (
  fieldId: string,
  answers: Record<string, unknown>,
) => {
  let form: UseFormReturn | undefined
  const Wrapper = () => {
    const methods = useForm()
    useEffect(() => {
      form = methods
    }, [methods])
    return (
      <FormProvider {...methods}>
        <TransferRights
          {...({} as CustomField)}
          application={{ answers, externalData: {} } as Application}
          field={{ id: fieldId } as CustomField}
        />
      </FormProvider>
    )
  }

  render(<Wrapper />)
  return () => form?.getValues()
}

describe('TransferRights', () => {
  const answers = {
    otherParentObj: { chooseOtherParent: 'manual' },
    transferRights: TransferRightsOption.NONE,
    requestRights: { isRequestingRights: 'no', requestDays: '0' },
    giveRights: { isGivingRights: 'no', giveDays: '0' },
  }

  it('shows the selection saved on the change form', () => {
    renderTransferRights('editTransferRights', {
      ...answers,
      editTransferRights: TransferRightsOption.REQUEST,
    })

    expect(lastRadio().field.defaultValue).toBe(TransferRightsOption.REQUEST)
  })

  it('keeps transferRights in sync with the selection on the change form', () => {
    const values = renderTransferRights('editTransferRights', answers)

    act(() => lastRadio().field.onSelect(TransferRightsOption.REQUEST))

    expect(values()).toEqual(
      expect.objectContaining({
        transferRights: TransferRightsOption.REQUEST,
        requestRights: { isRequestingRights: 'yes', requestDays: '1' },
      }),
    )
  })

  it('still reads transferRights on the application form', () => {
    renderTransferRights('transferRights', answers)

    expect(lastRadio().field.defaultValue).toBe(TransferRightsOption.NONE)
  })

  it('writes the shown selection to transferRights before any click', () => {
    const values = renderTransferRights('editTransferRights', {
      ...answers,
      editTransferRights: TransferRightsOption.REQUEST,
    })

    expect(values()).toEqual(
      expect.objectContaining({
        transferRights: TransferRightsOption.REQUEST,
        requestRights: { isRequestingRights: 'yes', requestDays: '1' },
      }),
    )
  })

  // Giving is disabled here: the manually entered other parent has no
  // right of access
  it('falls back to no transfer when the saved option can no longer be chosen', () => {
    const values = renderTransferRights('editTransferRights', {
      ...answers,
      editTransferRights: TransferRightsOption.GIVE,
      giveRights: { isGivingRights: 'yes', giveDays: '30' },
    })

    expect(lastRadio().field.defaultValue).toBe(TransferRightsOption.NONE)
    expect(values()).toEqual(
      expect.objectContaining({
        transferRights: TransferRightsOption.NONE,
        giveRights: { isGivingRights: 'no', giveDays: '0' },
      }),
    )
  })
})
