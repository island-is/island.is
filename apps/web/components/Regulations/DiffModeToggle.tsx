import React from 'react'
import cl from 'classnames'

import { LinkV2, ToggleSwitchLink } from '@island.is/island-ui/core'
import { ISODate, RegulationMaybeDiff } from '@island.is/regulations'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'

import { RegulationPageTexts } from './RegulationTexts.types'
import { useRegulationLinkResolver } from './regulationUtils'
import * as s from './DiffModeToggle.css'

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
    publishedDate,
    lastAmendDate,
    showingDiff,
    history: regulationHistory,
  } = regulation

  const history = regulationHistory.filter((h) => h.status === 'published')
  const firstEvent = history[0]

  if (!firstEvent || firstEvent.effect !== 'amend') {
    return null
  }
  const isDiffable = timelineDate !== publishedDate

  const diffView = !!showingDiff
  const showSecondaryButton =
    !!showingDiff && showingDiff.to !== history[0].date
  const diffIsAgainstOriginal =
    !!showingDiff && showingDiff.from === history[0].date

  return (
    <div className={cl(s.wrapper, !isDiffable && s.wrapperDisabled)}>
      <ToggleSwitchLink
        disabled={!isDiffable}
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
            <LinkV2
              href={linkToRegulation(regulation.name, {
                diff: true,
                ...(props.urlDate
                  ? { on: props.urlDate }
                  : { d: timelineDate || lastAmendDate }),
              })}
              color="blue400"
              underline="small"
              pureChildren
            >
              <a rel="nofollow">{txt('showDiff_fromLast')}</a>
            </LinkV2>
          ) : (
            <LinkV2
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
              pureChildren
            >
              <a rel="nofollow">{txt('showDiff_fromOriginal')}</a>
            </LinkV2>
          )}
        </div>
      )}
    </div>
  )
}
