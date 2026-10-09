/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/impacts/EditCancellation.tsx
 *
 * Modal for editing a regulation cancellation (brottfelling).
 *
 * Key adaptations from regulations-admin:
 * - Removed GraphQL mutations (createDraftRegulationCancel, updateDraftRegulationCancel)
 * - Replaced with useRegulationImpacts hook that writes to application answers
 * - Uses RegulationImpactSchema instead of DraftCancelForm
 * - No page reload on save — updates application answers directly
 * - Only this draft's own impacts are taken into account for the date range
 */
import {
  AlertMessage,
  Box,
  Button,
  Divider,
  GridContainer,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useMemo, useState } from 'react'
import { toISODate } from '@island.is/regulations'
import { LayoverModal } from './LayoverModal'
import { ImpactModalTitle } from './ImpactModalTitle'
import { RegulationImpactSchema } from '../../lib/dataSchema'
import { useRegulationFetch } from '../../hooks/useRegulationFetch'
import { getImpactChain } from '../../utils/getImpactChain'
import { ImpactHistory } from './ImpactHistory'

// ---------------------------------------------------------------------------

type EditCancellationProps = {
  /** The cancellation impact being edited (from answers.regulation.impacts[]) */
  cancellation: RegulationImpactSchema
  /** This draft's impacts on the same regulation */
  impacts?: RegulationImpactSchema[]
  /** Called when the modal should close. If impact was updated, passes the updated impact. */
  onSave: (impact: RegulationImpactSchema) => void | Promise<void>
  onClose: () => void
}

export const EditCancellation = (props: EditCancellationProps) => {
  const { cancellation, impacts = [], onSave, onClose } = props
  const today = useMemo(() => new Date(), [])
  const isSelf = cancellation.name === 'self'
  const { regulation, done } = useRegulationFetch(
    isSelf ? undefined : cancellation.name,
  )

  // A repeal can't come before this draft's changes or scheduled changes
  const { minDate, upcoming } = useMemo(
    () =>
      getImpactChain({
        impact: cancellation,
        impacts,
        history: regulation?.history,
        defaultMinDate: today,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cancellation.id, cancellation.date, impacts, regulation, today],
  )
  const [activeDate, setActiveDate] = useState<Date | undefined>(
    cancellation.date ? new Date(cancellation.date) : undefined,
  )
  const effectiveDate =
    activeDate && activeDate > minDate ? activeDate : minDate
  const shownDate =
    cancellation.date ??
    (toISODate(minDate) > toISODate(today) ? toISODate(minDate) : undefined)
  const [saving, setSaving] = useState(false)
  // Without the regulation's history, scheduled changes can't be checked
  const fetchFailed = !isSelf && done && !regulation

  const changeCancelDate = (newDate: Date | undefined) => {
    setActiveDate(newDate)
  }

  const saveCancellation = async () => {
    if (saving) return
    setSaving(true)
    try {
      await onSave({
        ...cancellation,
        date: toISODate(effectiveDate),
      })
    } finally {
      setSaving(false)
    }
  }

  const isValidImpact = () => {
    // Wait for the scheduled changes, which the date must not come before
    return !!effectiveDate && (isSelf || (done && !fetchFailed))
  }

  return (
    <LayoverModal closeModal={onClose} id="EditCancellationModal">
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '6/12']}
            offset={['0', '0', '0', '2/12']}
          >
            <ImpactModalTitle
              type="cancel"
              name={cancellation.name}
              title={
                cancellation.name === 'self'
                  ? 'stofnreglugerð'
                  : cancellation.regTitle || cancellation.name
              }
              date={shownDate}
              minDate={minDate}
              onChangeDate={changeCancelDate}
              tag={{
                first: 'Brottfelling reglugerðar',
                second: 'Stofnreglugerð',
              }}
            />
          </GridColumn>
        </GridRow>

        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '10/12', '8/12']}
            offset={['0', '0', '0', '1/12', '2/12']}
          >
            <ImpactHistory
              impactDate={effectiveDate}
              upcoming={upcoming}
              targetName={cancellation.name}
            />
            {fetchFailed && (
              <Box marginBottom={4}>
                <AlertMessage
                  type="error"
                  title="Ekki tókst að sækja reglugerðina"
                  message="Ekki tókst að sækja reglugerðina og væntanlegar breytingar á henni. Reyndu aftur síðar."
                />
              </Box>
            )}
            <Box paddingY={5}>
              <Divider />
            </Box>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
            >
              <Button
                onClick={onClose}
                variant="text"
                size="small"
                preTextIcon="arrowBack"
              >
                Til baka
              </Button>
              <Button
                onClick={saveCancellation}
                size="small"
                icon="arrowForward"
                disabled={!isValidImpact() || saving}
                loading={saving}
              >
                Vista brottfellingu
              </Button>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </LayoverModal>
  )
}
