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
 */
import {
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

// ---------------------------------------------------------------------------

type EditCancellationProps = {
  /** The cancellation impact being edited (from answers.regulation.impacts[]) */
  cancellation: RegulationImpactSchema
  /** Called when the modal should close. If impact was updated, passes the updated impact. */
  onSave: (impact: RegulationImpactSchema) => void
  onClose: () => void
}

export const EditCancellation = (props: EditCancellationProps) => {
  const { cancellation, onSave, onClose } = props
  const today = useMemo(() => new Date(), [])
  const [minDate] = useState(today)
  const [activeDate, setActiveDate] = useState<Date | undefined>(
    cancellation.date ? new Date(cancellation.date) : today,
  )

  const changeCancelDate = (newDate: Date | undefined) => {
    setActiveDate(newDate)
  }

  const saveCancellation = () => {
    onSave({
      ...cancellation,
      date: toISODate(activeDate ?? today),
    })
  }

  const isValidImpact = () => {
    return !!activeDate
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
              date={cancellation.date}
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
                disabled={!isValidImpact()}
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
