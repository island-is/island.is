import * as s from './DiffModeToggle.treat'

import { Link, ToggleSwitchLink } from '@island.is/island-ui/core'
import React from 'react'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { useRegulationLinkResolver } from './regulationUtils'
import { RegulationMaybeDiff } from '@island.is/regulations/web'
import { ISODate } from '@hugsmidjan/regulations-editor/types'

export type DiffModeToggleProps = {
  regulation: RegulationMaybeDiff
  urlDate?: ISODate
  texts: RegulationPageTexts
}

export const DiffModeToggle = (props: DiffModeToggleProps) => {
  const txt = useNamespace(props.texts)
  const { linkToRegulation } = useRegulationLinkResolver()

  const { regulation } = props
  const {
    timelineDate,
    effectiveDate,
    lastAmendDate,
    showingDiff,
    history,
  } = regulation

  const firstEvent = regulation.history[0]
  const isDiffable =
    firstEvent &&
    firstEvent.effect === 'amend' &&
    timelineDate !== effectiveDate

  if (!isDiffable) {
    return null
  }

  console.log({ showingDiff, history })

  const diffView = !!showingDiff
  const showSecondaryButton =
    !!showingDiff && showingDiff.to !== history[0].date
  const diffIsAgainstOriginal =
    !!showingDiff && showingDiff.from === history[0].date

  return (
    <div className={s.wrapper}>
      <ToggleSwitchLink
        className={s.toggler}
        checked={diffView}
        href={linkToRegulation(regulation.name, {
          diff: !diffView,
          ...(props.urlDate
            ? { on: props.urlDate }
            : timelineDate
            ? { d: timelineDate }
            : !diffView
            ? { d: lastAmendDate }
            : undefined),
        })}
        scroll={false}
        linkText={diffView ? txt('hideDiff') : txt('showDiff')}
        label={txt('showDiff')}
      />
      {showSecondaryButton && (
        <div className={s.totalToggler}>
          {diffIsAgainstOriginal ? (
            <Link
              href={linkToRegulation(regulation.name, {
                diff: true,
                ...(props.urlDate
                  ? { on: props.urlDate }
                  : { d: timelineDate || lastAmendDate }),
              })}
              color="blue400"
              underline="small"
            >
              {txt('showDiff_fromLast')}
            </Link>
          ) : (
            <Link
              href={linkToRegulation(regulation.name, {
                diff: true,
                ...(props.urlDate
                  ? { on: props.urlDate, earlierDate: 'original' }
                  : timelineDate
                  ? { d: timelineDate, earlierDate: 'original' }
                  : undefined),
              })}
              color="blue400"
              underline="small"
            >
              {txt('showDiff_fromOriginal')}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
