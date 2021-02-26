import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { RadioController } from '@island.is/shared/form-fields'
import { YES, NO } from '../shared'

export const WalledRadio: FC<FieldBaseProps> = ({
  field,
  application,
  error,
}) => {
  const [isError, setIsError] = useState(false)

  const handleSelect = (value: string) =>
    value === YES ? setIsError(true) : setIsError(false)

  return (
    <>
      <RadioController
        id={field.id}
        disabled={false}
        name="Walled radio"
        options={[
          {
            label: 'Já',
            value: YES,
          },
          {
            label: 'Nei',
            value: NO,
          },
        ]}
        error={error}
        onSelect={handleSelect}
      />
      {isError && <div>Error</div>}
    </>
  )
}
