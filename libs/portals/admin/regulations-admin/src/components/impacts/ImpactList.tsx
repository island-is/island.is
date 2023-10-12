import { useCallback, useEffect, useState } from 'react'
import {
  ActionCard,
  AlertMessage,
  Box,
  Divider,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { prettyName, RegName } from '@island.is/regulations'
import { impactMsgs } from '../../lib/messages'
import {
  DraftImpactForm,
  GroupedDraftImpactForms,
  RegDraftForm,
} from '../../state/types'
import { EditCancellation } from './EditCancellation'
import { EditChange } from './EditChange'
import { useMutation } from '@apollo/client'
import {
  DELETE_DRAFT_REGULATION_CANCEL,
  DELETE_DRAFT_REGULATION_CHANGE,
} from './impactQueries'

// ---------------------------------------------------------------------------

export type ImpactListProps = {
  draft: RegDraftForm
  impacts: GroupedDraftImpactForms
  title?: string | JSX.Element
  titleEmpty?: string | JSX.Element
}

export const ImpactList = (props: ImpactListProps) => {
  const { draft, impacts, title, titleEmpty } = props

  const { formatMessage, formatDateFns } = useLocale()
  const t = formatMessage

  const [chooseType, setChooseType] = useState<{
    impact: DraftImpactForm | undefined
    readonly: boolean
  }>()

  const [deleteDraftRegulationCancel] = useMutation(
    DELETE_DRAFT_REGULATION_CANCEL,
  )
  const [deleteDraftRegulationChange] = useMutation(
    DELETE_DRAFT_REGULATION_CHANGE,
  )

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

  const closeModal = (reload?: boolean) => {
    setChooseType(undefined)
    if (reload) {
      document.location.reload()
    }
  }

  const deleteImpact = async (impact: DraftImpactForm) => {
    if (impact) {
      if (impact.type === 'amend') {
        await deleteDraftRegulationChange({
          variables: {
            input: {
              id: impact.id,
            },
          },
        })
      } else {
        await deleteDraftRegulationCancel({
          variables: {
            input: {
              id: impact.id,
            },
          },
        })
      }
      document.location.reload()
    }
  }

  return (
    <>
      <Box marginTop={[6, 8, 12]}>
        <Divider />
        {' '}
      </Box>

      {!Object.keys(impacts).length ? (
        <Text variant="h3" as="h3">
          {titleEmpty || t(impactMsgs.impactListTitleEmpty)}
        </Text>
      ) : (
        <Stack space={3}>
          <Text variant="h3" as="h3">
            {title || t(impactMsgs.impactListTitle)}
          </Text>
          {Object.keys(impacts).map((impGrp, i) => {
            const impactGroup = impacts[impGrp]
            return (
              <Stack space={3} key={impGrp + '-' + i}>
                <Text variant="h4" as="h4" marginTop={i === 0 ? 0 : 5}>
                  {impGrp === 'self'
                    ? t(impactMsgs.selfAffecting)
                    : `Breytingar á ${prettyName(impGrp as RegName)}`}
                </Text>
                {impactGroup.map((impact, idx) => {
                  const { id, name, regTitle, error, type, date } = impact
                  const isChange = type === 'amend'
                  const headingText =
                    name === 'self'
                      ? draft.title.value
                      : `${prettyName(name)} – ${regTitle}`
                  const errorMessage = !error
                    ? undefined
                    : typeof error === 'string'
                    ? error
                    : t(error)

                  return (
                    <ActionCard
                      key={id}
                      date={
                        date.value && formatDateFns(date.value, 'd. MMM yyyy')
                      }
                      heading={headingText}
                      tag={{
                        label: t(
                          isChange
                            ? impactMsgs.typeChange
                            : impactMsgs.typeCancellation,
                        ),
                        variant: isChange ? 'blueberry' : 'red',
                      }}
                      cta={{
                        icon: undefined,
                        label:
                          idx !== impactGroup.length - 1
                            ? formatMessage(impactMsgs.impactListViewButton)
                            : formatMessage(impactMsgs.impactListEditButton),
                        variant: 'ghost',
                        onClick: () => {
                          setChooseType({
                            impact,
                            readonly: idx !== impactGroup.length - 1,
                          })
                        },
                      }}
                      deleteButton={{
                        icon: 'trash',
                        visible: idx === impactGroup.length - 1,
                        dialogTitle: formatMessage(
                          impactMsgs.impactListDeleteButton,
                        ),
                        dialogDescription: formatMessage(
                          impactMsgs.deleteConfirmation,
                        ),
                        dialogConfirmLabel: formatMessage(
                          impactMsgs.impactListDeleteButton,
                        ),
                        dialogCancelLabel: formatMessage(
                          impactMsgs.cancelButton,
                        ),
                        disabled: idx !== impactGroup.length - 1,
                        onClick: () => {
                          deleteImpact(impact)
                          setTimeout(() => {
                            document.location.reload()
                          }, 250)
                        },
                      }}
                      text={
                        errorMessage &&
                        ((
                          <AlertMessage type="error" title={errorMessage} />
                        ) as unknown as string)
                      }
                    />
                  )
                })}
              </Stack>
            )
          })}
          {chooseType?.impact?.type === 'repeal' && (
            <EditCancellation
              draft={draft}
              cancellation={chooseType.impact}
              closeModal={closeModal}
            />
          )}
          {chooseType?.impact?.type === 'amend' && (
            <EditChange
              draft={draft}
              change={chooseType.impact}
              readOnly={chooseType.readonly}
              closeModal={closeModal}
            />
          )}
        </Stack>
      )}
    </>
  )
}
