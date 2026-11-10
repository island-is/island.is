import parseISO from 'date-fns/parseISO'
import {
  AlertMessage,
  Box,
  Button,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { prettyName, RegName } from '@island.is/regulations'
import { RegulationImpactSchema } from '../../lib/dataSchema'
import { Routes } from '../../lib/constants'
import { regulation } from '../../lib/messages'
import { getImpactsOffEffectiveDate } from '../../utils/regulationValidations'
import { formatDate } from '../../utils/formatAmendingUtils'

type ImpactDateWarningProps = {
  effectiveDate?: string
  impacts?: RegulationImpactSchema[]
  /** Opens the impacts step, where each impact's date is changed and checked */
  goToScreen?: (screenId: string) => void
}

/**
 * Warns when impacts on other regulations aren't dated on the regulation's
 * effective date. The dates aren't moved for the advertiser: each impact's
 * text is built for its own date, so a new date has to go through the checks
 * the impact modal runs on save.
 */
export const ImpactDateWarning = ({
  effectiveDate,
  impacts,
  goToScreen,
}: ImpactDateWarningProps) => {
  const { formatMessage: f } = useLocale()
  const offDate = getImpactsOffEffectiveDate(effectiveDate, impacts)

  if (!effectiveDate || offDate.length === 0) {
    return null
  }

  const messages = regulation.summary.impactsOffEffectiveDate

  return (
    <Box marginBottom={3}>
      <AlertMessage
        type="warning"
        title={f(messages.title)}
        message={
          <Stack space={2}>
            <Text variant="small">
              {f(messages.message, {
                effectiveDate: formatDate(parseISO(effectiveDate)),
                regulations: [
                  ...new Set(
                    offDate.map((impact) => prettyName(impact.name as RegName)),
                  ),
                ].join(', '),
              })}
            </Text>
            {goToScreen && (
              <Button
                onClick={() => goToScreen(Routes.REGULATION_IMPACTS)}
                size="small"
                variant="text"
                preTextIcon="arrowBack"
              >
                {f(messages.openImpacts)}
              </Button>
            )}
          </Stack>
        }
      />
    </Box>
  )
}
