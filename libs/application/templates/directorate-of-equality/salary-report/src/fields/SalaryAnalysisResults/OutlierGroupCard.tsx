import { FC } from 'react'
import { getErrorViaPath } from '@island.is/application/core'
import { RecordObject } from '@island.is/application/types'
import { AccordionCard, Box, Button } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import type { OutlierGroupAnswer } from '../../utils/outlierGroups'

type Props = {
  fieldId: string
  fieldName: string
  index: number
  group: OutlierGroupAnswer
  mode: 'draft' | 'postponed'
  errors?: RecordObject
  identifierForOrdinal: (ordinal: number) => string
  onRemove: () => void
}

// One accordion card per outlier group, split out of OutlierEditor.
export const OutlierGroupCard: FC<Props> = ({
  fieldId,
  fieldName,
  index,
  group,
  mode,
  errors,
  identifierForOrdinal,
  onRemove,
}) => {
  const { formatMessage } = useLocale()
  const m = messages.salaryAnalysis.outlierGroup

  const groupError = (suffix: string) =>
    mode === 'postponed' && errors
      ? getErrorViaPath(errors, `${fieldName}.${index}.${suffix}`)
      : undefined

  return (
    <Box marginBottom={3}>
      <AccordionCard
        id={fieldId}
        label={`${formatMessage(m.groupHeading)} ${index + 1}`}
        visibleContent={`${formatMessage(
          m.groupMembers,
        )}: ${group.employeeOrdinals.map(identifierForOrdinal).join(', ')}`}
        startExpanded
      >
        <Box marginBottom={2} display="flex" justifyContent="flexEnd">
          <Button variant="text" size="small" onClick={onRemove}>
            {formatMessage(m.removeGroupButton)}
          </Button>
        </Box>
        <InputController
          id={`${fieldName}.${index}.reason`}
          name={`${fieldName}.${index}.reason`}
          label={formatMessage(m.reasonLabel)}
          textarea
          backgroundColor="blue"
          error={groupError('reason')}
        />
        <Box marginTop={2}>
          <InputController
            id={`${fieldName}.${index}.action`}
            name={`${fieldName}.${index}.action`}
            label={formatMessage(m.actionLabel)}
            textarea
            backgroundColor="blue"
            error={groupError('action')}
          />
        </Box>
        <Box marginTop={2} display="flex" columnGap={2}>
          <Box style={{ flex: 1 }}>
            <InputController
              id={`${fieldName}.${index}.signatureName`}
              name={`${fieldName}.${index}.signatureName`}
              label={formatMessage(m.signatureNameLabel)}
              backgroundColor="blue"
              error={groupError('signatureName')}
            />
          </Box>
          <Box style={{ flex: 1 }}>
            <InputController
              id={`${fieldName}.${index}.signatureRole`}
              name={`${fieldName}.${index}.signatureRole`}
              label={formatMessage(m.signatureRoleLabel)}
              backgroundColor="blue"
              error={groupError('signatureRole')}
            />
          </Box>
        </Box>
      </AccordionCard>
    </Box>
  )
}
