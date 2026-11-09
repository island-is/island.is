import { FC, useEffect, useMemo } from 'react'

import { FieldBaseProps } from '@island.is/application/types'
import { buildRadioField } from '@island.is/application/core'

import { useFormContext } from 'react-hook-form'
import { applicationMessages as m } from '../lib/messages'
import { getHomeLodgings } from '../utils/homeLodgings'

export const HomeLodgingPicker: FC<FieldBaseProps> = ({
  application,
  renderField,
}) => {
  const { setValue, watch } = useFormContext()
  const year = Number(watch('year'))
  const selectedId = watch('homeLodgingId') as string | undefined

  const lodgings = useMemo(
    () =>
      getHomeLodgings(application.externalData).filter(
        (registration) => registration.year === year,
      ),
    [application.externalData, year],
  )

  // A lodging selected for a previous year is not valid for the new one.
  useEffect(() => {
    if (
      selectedId &&
      !lodgings.some((registration) => registration.id === selectedId)
    ) {
      setValue('homeLodgingId', '', { shouldDirty: true })
    }
  }, [lodgings, selectedId, setValue])

  if (!year) {
    return null
  }

  return renderField?.(
    buildRadioField({
      id: 'homeLodgingId',
      title: m.homeLodgingSelectionTitle,
      required: true,
      largeButtons: true,
      width: 'half',
      options: lodgings.map((registration) => ({
        value: registration.id,
        label: registration.name,
        subLabel: registration.id,
        disabled: registration.hasBeenSubmitted,
        ...(registration.hasBeenSubmitted && {
          tooltip: m.homeLodgingAlreadySubmitted,
        }),
      })),
    }),
  )
}
