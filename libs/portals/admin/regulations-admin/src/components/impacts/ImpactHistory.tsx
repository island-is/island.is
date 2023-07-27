import { Box, Text } from '@island.is/island-ui/core'
import { ImpactListItem } from './ImpactListItem'
import { nameToSlug, prettyName, toISODate } from '@island.is/regulations'
import {
  DraftImpactId,
  DraftImpactName,
  RegulationDraftId,
  RegulationHistoryItemAdmin,
} from '@island.is/regulations/admin'
import * as s from './Impacts.css'

export type ImpactHistoryProps = {
  impactDate?: Date
  allFutureEffects: RegulationHistoryItemAdmin[]
  targetName: DraftImpactName
  draftId: RegulationDraftId
  impactId?: DraftImpactId
}

export const ImpactHistory = (props: ImpactHistoryProps) => {
  const { impactDate, allFutureEffects, targetName, draftId, impactId } = props

  const hasMismatchId = (effect: RegulationHistoryItemAdmin) => {
    return !!(effect.changingId && draftId && effect.changingId !== draftId)
  }

  if (!impactDate || !targetName) {
    return null
  }

  return (
    <Box background="blueberry100" paddingY={3} paddingX={4} marginBottom={7}>
      <Box
        className={s.border}
        display="flex"
        alignItems="flexEnd"
        borderBottomWidth="standard"
        borderColor="purple200"
      >
        <Text variant="h4" color="blueberry600">
          Væntanlegar breytingar á{' '}
          {targetName === 'self'
            ? 'reglugerðinni'
            : `reglugerð ${prettyName(targetName)}`}
        </Text>
        <Box className={s.line} marginX={2} />
        {targetName !== 'self' && (
          <a
            href={`https://island.is/reglugerdir/nr/${nameToSlug(targetName)}`}
            target="_blank"
            rel="noreferrer"
          >
            <Text variant="h5" color="blueberry600">
              Sjá núgildandi
            </Text>
          </a>
        )}
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="flexStart"
        className={s.history}
      >
        <>
          {allFutureEffects.map((effect, i) => (
            <ImpactListItem
              key={targetName + '_' + effect.date + '_' + i}
              effect={effect}
              idMismatch={hasMismatchId(effect)}
              activeName={targetName}
            />
          ))}

          {!allFutureEffects.find((i) => i.id === impactId) ? (
            <ImpactListItem
              effect={{
                date: toISODate(impactDate),
                name: targetName,
                title: 'active',
                effect: 'repeal',
                origin: 'self',
                id: 'self',
              }}
              idMismatch={false}
              activeName={targetName}
            />
          ) : null}
        </>
      </Box>
    </Box>
  )
}
