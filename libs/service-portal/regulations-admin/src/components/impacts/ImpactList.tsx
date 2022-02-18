import React, { useCallback, useEffect, useState } from 'react'
import {
  ActionCard,
  AlertMessage,
  Box,
  Divider,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { prettyName, toISODate } from '@island.is/regulations'
import { impactMsgs } from '../../messages'
import { DraftImpactForm, RegDraftForm } from '../../state/types'
import { EditCancellation } from './EditCancellation'
import { EditChange } from './EditChange'
import {
  makeDraftCancellationForm,
  makeDraftChangeForm,
} from '../../state/makeFields'
import { useMutation } from '@apollo/client'
import {
  DELETE_DRAFT_REGULATION_CANCEL,
  DELETE_DRAFT_REGULATION_CHANGE,
} from './impactQueries'

// ---------------------------------------------------------------------------

export type ImpactListProps = {
  draft: RegDraftForm
  impacts: ReadonlyArray<DraftImpactForm>
  title?: string | JSX.Element
  titleEmpty?: string | JSX.Element
}

export const ImpactList = (props: ImpactListProps) => {
  const { draft, impacts, title, titleEmpty } = props

  const { formatMessage, formatDateFns } = useLocale()
  const t = formatMessage

  const [chooseType, setChooseType] = useState<DraftImpactForm | undefined>()

  const [deleteDraftRegulationCancel] = useMutation(
    DELETE_DRAFT_REGULATION_CANCEL,
  )
  const [deleteDraftRegulationChange] = useMutation(
    DELETE_DRAFT_REGULATION_CHANGE,
  )

  const escClick = useCallback((e) => {
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

  const deleteImpact = (impact: DraftImpactForm) => {
    if (impact.type === 'amend') {
      deleteDraftRegulationChange({
        variables: {
          input: {
            id: impact.id,
          },
        },
      })
    } else {
      deleteDraftRegulationCancel({
        variables: {
          input: {
            id: impact.id,
          },
        },
      })
    }
  }

  return (
    <>
      <Box marginTop={[6, 8, 12]}>
        <Divider />
        {' '}
      </Box>

      {!impacts.length ? (
        <Text variant="h3" as="h3">
          {titleEmpty || t(impactMsgs.impactListTitleEmpty)}
        </Text>
      ) : (
        <Stack space={3}>
          <Text variant="h3" as="h3">
            {title || t(impactMsgs.impactListTitle)}
          </Text>

          {impacts.map((impact, i) => {
            const { id, name, regTitle, error, type, date } = impact

            const isChange = type === 'amend'
            const headingText =
              name === 'self'
                ? t(impactMsgs.selfAffecting)
                : `${prettyName(name)} – ${regTitle}`
            const errorMessage = !error
              ? undefined
              : typeof error === 'string'
              ? error
              : t(error)

            return (
              <ActionCard
                key={i}
                date={date.value && formatDateFns(date.value)}
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
                  label: formatMessage(impactMsgs.impactListEditButton),
                  variant: 'ghost',
                  onClick: () => {
                    setChooseType(impact)
                  },
                }}
                secondaryCta={{
                  icon: 'trash',
                  label: formatMessage(impactMsgs.impactListDeleteButton),
                  onClick: () => {
                    deleteImpact(impact)
                  },
                }}
                text={
                  errorMessage &&
                  (((
                    <AlertMessage type="error" title={errorMessage} />
                  ) as unknown) as string)
                }
                // backgroundColor={error ? 'red' : undefined}
              />
            )
          })}

          {chooseType?.type === 'repeal' && (
            <EditCancellation
              draft={draft}
              cancellation={makeDraftCancellationForm({
                type: 'repeal',
                id: chooseType.id,
                name: chooseType.name,
                regTitle: chooseType.regTitle,
                date: toISODate(chooseType.date.value) ?? undefined,
              })}
              closeModal={() => setChooseType(undefined)}
            />
          )}

          {chooseType?.type === 'amend' && (
            <EditChange
              draft={draft}
              change={makeDraftChangeForm({
                type: 'amend',
                id: chooseType.id,
                name: chooseType.name,
                regTitle: chooseType.regTitle,
                title: chooseType.title.value,
                text: chooseType.text.value,
                appendixes: chooseType.appendixes.map((apx) => ({
                  title: apx.title.value,
                  text: apx.text.value,
                })),
                comments: '',
              })}
              closeModal={() => setChooseType(undefined)}
            />
          )}
        </Stack>
      )}
    </>
  )
}
