import * as s from './impacts/Impacts.css'

import { useCallback, useEffect, useState } from 'react'

import { useDraftingState } from '../state/useDraftingState'
import { impactMsgs } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { nameToSlug, RegName, RegulationType } from '@island.is/regulations'
import {
  DraftImpactName,
  DraftRegulationCancelId,
  DraftRegulationChangeId,
} from '@island.is/regulations/admin'

import { ImpactList } from './impacts/ImpactList'
import {
  AlertMessage,
  Box,
  Button,
  Divider,
  Inline,
  Link,
  Option,
  Text,
} from '@island.is/island-ui/core'
import { EditCancellation } from './impacts/EditCancellation'
import {
  makeDraftCancellationForm,
  makeDraftChangeForm,
} from '../state/makeFields'
import { EditChange } from './impacts/EditChange'
import lastItem from 'lodash/last'
import { ImpactBaseSelection } from './impacts/ImpactBaseSelection'
import { ImpactAmendingSelection } from './impacts/ImpactAmendingSelection'
import { RegulationDraftTypes, StepNames } from '../types'

export type SelRegOption = Option<DraftImpactName | ''> & {
  type: RegulationType | ''
  migrated?: boolean
}

// ---------------------------------------------------------------------------

export const EditImpacts = () => {
  const { draft, actions } = useDraftingState()
  const t = useLocale().formatMessage

  const { goToStep } = actions

  const [selRegOption, setSelRegOption] = useState<SelRegOption | undefined>()
  const [chooseType, setChooseType] = useState<
    'cancel' | 'change' | undefined
  >()

  const closeModal = (reload?: boolean) => {
    setChooseType(undefined)
    if (reload) {
      // TODO: fetch new regulations instead of reloading page?
      document.location.reload()
    }
  }

  const onClickChange = () => {
    setChooseType('change')
  }

  const escClick = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setChooseType(undefined)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escClick, false)

    return () => {
      document.removeEventListener('keydown', escClick, false)
    }
  }, [escClick])

  return (
    <>
      {draft.type.value === RegulationDraftTypes.base && (
        <Box marginBottom={3} className={s.explainerText}>
          <AlertMessage
            type="info"
            message={
              <div>
                {t(impactMsgs.regExplainer)}
                {'    '}
                <Button
                  onClick={() => goToStep(StepNames.basics)}
                  variant="text"
                  size="small"
                >
                  {t(impactMsgs.regExplainer_editLink)}
                </Button>
              </div>
            }
          />
        </Box>
      )}

      <Box marginBottom={4}>
        {draft.type.value === RegulationDraftTypes.base ? (
          <ImpactBaseSelection
            setImpactRegOption={(option) => setSelRegOption(option)}
          />
        ) : (
          <ImpactAmendingSelection
            setImpactRegOption={(option) => setSelRegOption(option)}
          />
        )}
      </Box>

      {selRegOption && (
        <Box marginBottom={[4, 4, 8]}>
          <Box marginBottom={2}>
            <Divider weight="regular" />
            {' '}
          </Box>
          <Text variant="h4" as="h4" marginBottom={[2, 2, 3, 4]}>
            {t(impactMsgs.chooseType)}
          </Text>
          {!selRegOption.migrated && selRegOption.value !== 'self' ? (
            <Inline align="center">
              <h3>
                Villa:{' '}
                <Link
                  href={`https://island.is/reglugerdir/nr/${nameToSlug(
                    selRegOption.value as RegName,
                  )}`}
                  color="blue400"
                  underlineVisibility="hover"
                  newTab
                >
                  Reglugerð {selRegOption.value}
                </Link>{' '}
                hefur ekki verið flutt á island.is.
                <br /> Vinsamlegast hafið samband við ritstjóra.
              </h3>
            </Inline>
          ) : lastItem(draft.impacts[selRegOption.value])?.type === 'repeal' ? (
            <Inline align="center">
              <Text variant="h5" as="h5">
                Reglugerð er með virka brottfellingu og því ekki hægt að skrá
                frekari áhrifafærslur.
              </Text>
            </Inline>
          ) : (
            <Inline space={[2, 2, 3, 4]} align="center" alignY="center">
              {selRegOption.type === RegulationDraftTypes.base && (
                <>
                  <Button
                    variant="ghost"
                    icon="document"
                    iconType="outline"
                    onClick={onClickChange}
                  >
                    {t(impactMsgs.chooseType_change)}
                  </Button>
                  <span> {t(impactMsgs.chooseType_or)} </span>
                </>
              )}
              <Button
                variant="ghost"
                icon="fileTrayFull"
                iconType="outline"
                onClick={() => setChooseType('cancel')}
              >
                {t(impactMsgs.chooseType_cancel)}
              </Button>
            </Inline>
          )}

          {chooseType === 'cancel' && (
            <EditCancellation
              draft={draft}
              cancellation={makeDraftCancellationForm({
                type: 'repeal',
                id: '' as DraftRegulationCancelId, // no ID available at this stage
                name: selRegOption.value as DraftImpactName,
                regTitle: selRegOption.label,
                date: undefined,
              })}
              closeModal={closeModal}
            />
          )}

          {chooseType === 'change' && (
            <EditChange
              draft={draft}
              change={makeDraftChangeForm({
                type: 'amend',
                id: '' as DraftRegulationChangeId, // no ID available at this stage
                name: selRegOption.value as DraftImpactName,
                regTitle: selRegOption.label,
                date: undefined,
                title: '',
                text: '',
                appendixes: [],
                comments: '',
              })}
              closeModal={closeModal}
            />
          )}
        </Box>
      )}

      <ImpactList draft={draft} impacts={draft.impacts} />
    </>
  )
}
