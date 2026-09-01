import { useEffect, useRef } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/types'
import { YES } from '@island.is/application/core'

// Renders nothing. Discards the table's beforeSubmit callback the moment
// includesSubsidiaries leaves "yes", since an open row unmounts without
// unregistering it and would otherwise block navigation forever.
export const SubsidiariesFormGuard = ({
  setBeforeSubmitCallback,
}: FieldBaseProps) => {
  const { control } = useFormContext()
  const includesSubsidiaries = useWatch({
    control,
    name: 'subsidiaries.includesSubsidiaries',
  })
  const wasYes = useRef(includesSubsidiaries === YES)

  useEffect(() => {
    const isYes = includesSubsidiaries === YES
    if (wasYes.current && !isYes) {
      setBeforeSubmitCallback?.(null)
    }
    wasYes.current = isYes
  }, [includesSubsidiaries, setBeforeSubmitCallback])

  return null
}
