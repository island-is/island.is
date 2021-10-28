import * as s from './RegulationsSidebarBox.css'

import React, { useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import { Text } from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { ISODate, interpolate, prettyName } from '@island.is/regulations'
import {
  RegulationHistoryItem,
  RegulationMaybeDiff,
} from '@island.is/regulations/web'
import {
  RegulationsSidebarBox,
  RegulationsSidebarLink,
} from './RegulationsSidebarBox'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useDateUtils, useRegulationLinkResolver } from './regulationUtils'

type Effects = Array<RegulationHistoryItem>

const CHANGELOG_COLLAPSE_LIMIT = 10

export const useRegulationEffectPrepper = (
  props: RegulationChangelogProps,
  opts: { reverse?: boolean } = {},
) => {
  const { regulation, texts } = props
  const txt = useNamespace(texts)
  const { formatDate } = useDateUtils()
  const { linkToRegulation } = useRegulationLinkResolver()
  const today = new Date().toISOString().substr(0, 10) as ISODate

  const { effects, isViewingCurrent } = useMemo(() => {
    const effects = regulation.history.reduce<
      Record<'past' | 'future', Effects>
    >(
      (obj, item, i) => {
        const arr = item.date > today ? obj.future : obj.past
        arr.push(item)
        return obj
      },
      { past: [], future: [] },
    )
    if (opts.reverse) {
      effects.past.reverse()
      effects.future.reverse()
    }
    const isViewingCurrent =
      (!regulation.timelineDate &&
        (!regulation.showingDiff ||
          regulation.showingDiff.from <= regulation.effectiveDate)) ||
      undefined

    return {
      effects,
      isViewingCurrent,
    }
  }, [regulation, today, opts.reverse])

  const [expanded, setExpanded] = useState(
    () => effects.past.length < CHANGELOG_COLLAPSE_LIMIT,
  )
  useEffect(() => {
    setExpanded(effects.past.length < CHANGELOG_COLLAPSE_LIMIT)
  }, [effects])

  const isItemCurrent = (itemDate: ISODate) =>
    (regulation.timelineDate ||
      (!isViewingCurrent && regulation.lastAmendDate)) === itemDate

  const renderCurrentVersion = () => (
    <RegulationsSidebarLink
      href={linkToRegulation(regulation.name)}
      current={isViewingCurrent}
    >
      <span className={isViewingCurrent && s.changelogCurrent}>
        {txt('historyCurrentVersion')}
      </span>
    </RegulationsSidebarLink>
  )

  const renderOriginalVersion = () => {
    const current = isItemCurrent(regulation.effectiveDate)
    return (
      <RegulationsSidebarLink
        href={linkToRegulation(regulation.name, { original: true })}
        current={current}
      >
        <strong>{formatDate(regulation.effectiveDate)}</strong>
        <br />
        <span className={cn(s.smallText, current && s.changelogCurrent)}>
          {txt(
            regulation.type === 'base'
              ? 'historyStart'
              : 'historyStartAmending',
          )}
        </span>
      </RegulationsSidebarLink>
    )
  }

  const renderEffects = (effects: Effects, collapse?: boolean) => {
    const effectList =
      !collapse || expanded
        ? effects
        : effects.slice(0, Math.max(CHANGELOG_COLLAPSE_LIMIT - 3, 1))

    return (
      <>
        {effectList.map((item, i) => {
          const name = prettyName(item.name)

          const label = interpolate(
            item.effect === 'amend'
              ? txt('historyChange')
              : txt('historyCancel'),
            { name },
          )
          const href =
            item.effect === 'amend'
              ? linkToRegulation(regulation.name, {
                  d: item.date,
                  diff: true,
                })
              : undefined

          const current = isItemCurrent(item.date)
          const className = cn(s.smallText, current && s.changelogCurrent)

          const Content = (
            <>
              <strong>{formatDate(item.date)}</strong>
              <br />
              <span className={className} title={label + ' ' + item.title}>
                {label}
              </span>
            </>
          )

          return href ? (
            <RegulationsSidebarLink key={i} href={href} current={current}>
              {Content}
            </RegulationsSidebarLink>
          ) : (
            <span className={s.sidebarNonLink}>{Content}</span>
          )
        })}
        {collapse && !expanded && (
          <button
            type="button"
            className={s.showAllChanges}
            onClick={() => setExpanded(true)}
          >
            {txt('historyExpand', 'Sýna allar breytingar')}
          </button>
        )}
      </>
    )
  }

  const renderPastSplitter = () => (
    <Text variant="small" marginBottom={1}>
      {txt('historyPastSplitter')}:
    </Text>
  )
  const renderFutureSplitter = () => (
    <Text variant="small" marginBottom={1}>
      {txt('historyFutureSplitter')}:
    </Text>
  )

  return {
    boxTitle: interpolate(txt('historyTitle'), {
      name: prettyName(regulation.name),
    }),
    hasPastEffects: effects.past.length > 0,
    hasFutureEffects: effects.future.length > 0,
    isViewingCurrent,
    isItemCurrent,
    renderOriginalVersion,
    renderPastSplitter,
    renderPastEffects: (collapse?: boolean) =>
      renderEffects(effects.past, collapse),
    renderCurrentVersion,
    renderFutureSplitter,
    renderFutureEffects: () => renderEffects(effects.future),
  }
}

// ===========================================================================

// ===========================================================================

export type RegulationChangelogProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const RegulationChangelog = (props: RegulationChangelogProps) => {
  const {
    boxTitle,
    // hasPastEffects,
    hasFutureEffects,
    renderCurrentVersion,
    renderPastSplitter,
    renderPastEffects,
    renderOriginalVersion,
    renderFutureSplitter,
    renderFutureEffects,
  } = useRegulationEffectPrepper(props, { reverse: true })

  if (!props.regulation.history.length) {
    return null
  }

  return (
    <RegulationsSidebarBox title={boxTitle}>
      {renderCurrentVersion()}

      {hasFutureEffects && renderFutureSplitter()}
      {renderFutureEffects()}

      {renderPastSplitter()}
      {renderPastEffects(true)}
      {renderOriginalVersion()}
    </RegulationsSidebarBox>
  )
}
