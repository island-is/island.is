import { useEffect, useRef } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/types'
import { YES } from '@island.is/application/core'

/**
 * Renders nothing — it exists to discard the subsidiary table's beforeSubmit
 * callback when the applicant switches away from "yes".
 *
 * TableRepeaterFormField registers a callback that blocks navigation while a
 * row is open, and never unregisters it. Conditioning the table away leaves
 * that callback behind on the screen, still holding `activeIndex` from the
 * open row, so the applicant cannot continue until they reload the page.
 *
 * `null` is the only unregister the shell offers and it clears the whole
 * screen, which is safe here only because the table is the sole field on this
 * screen that registers one. Delete this component if the shell ever grows an
 * unmount cleanup of its own.
 */
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
