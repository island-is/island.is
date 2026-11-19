import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { FileUploadStatus, InputFileUpload } from './InputFileUpload'

it.each([true, false])(
  'blocks removal only when removeDisabled is %s, independently of upload disabling',
  async (removeDisabled) => {
    const onRemove = jest.fn()
    await act(async () => {
      render(
        <InputFileUpload
          name="attachment"
          files={[{ name: 'file.pdf', status: FileUploadStatus.done }]}
          disabled
          removeDisabled={removeDisabled}
          onRemove={onRemove}
        />,
      )
    })
    const remove = screen.getByRole('button', { name: 'Fjarlægja skrá' })
    expect(remove.hasAttribute('disabled')).toBe(removeDisabled)
    fireEvent.click(remove)
    expect(onRemove).toHaveBeenCalledTimes(removeDisabled ? 0 : 1)
  },
)
