import * as s from './RegulationDisplay.treat'

import React, { FC } from 'react'
import { useRouter } from 'next/router'
import { ISODate, RegulationMaybeDiff } from './Regulations.types'
import { RegulationPageTexts } from './RegulationTexts.types'
import { Button, Stack, Text } from '@island.is/island-ui/core'
import { RegulationLayout } from './RegulationLayout'
import { prettyName, useRegulationLinkResolver } from './regulationUtils'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { RegulationStatus } from './RegulationStatus'
import { Appendixes } from './Appendixes'
import { HTMLDump } from './HTMLDump'
import { CommentsBox } from './CommentsBox'
import { RegulationsToggleSwitch } from './RegulationsToggleSwitch'
import { RegulationInfoBox } from './RegulationInfoBox'
import { RegulationEffectsBox } from './RegulationEffectsBox'
import { RegulationTimeline } from './RegulationTimeline'

// ---------------------------------------------------------------------------

export type RegulationDisplayProps = {
  regulation: RegulationMaybeDiff
  urlDate?: ISODate
  texts: RegulationPageTexts
}

export const RegulationDisplay: FC<RegulationDisplayProps> = (props) => {
  const router = useRouter()
  const { regulation, texts } = props

  const txt = useNamespace(texts)
  const { linkToRegulation } = useRegulationLinkResolver()

  const name = prettyName(regulation.name)

  const diffView = !!regulation.showingDiff

  const timelineDate = regulation.timelineDate || ''
  const effectiveDate = regulation.effectiveDate
  const lastAmendDate = regulation.lastAmendDate || ''

  const isDiffable =
    regulation.history.length > 0 && timelineDate !== effectiveDate

  const isCurrent = !timelineDate || timelineDate === lastAmendDate
  const isUpcoming = !isCurrent && timelineDate > lastAmendDate

  const waterMarkClass = isCurrent
    ? undefined
    : s.oudatedWarning + (isUpcoming ? ' ' + s.upcomingWarning : '')

  return (
    <RegulationLayout
      name={regulation.name}
      texts={props.texts}
      main={
        <>
          {isDiffable && (
            <RegulationsToggleSwitch
              className={s.diffToggler}
              checked={diffView}
              href={linkToRegulation(regulation.name, {
                diff: !diffView,
                ...(props.urlDate
                  ? { on: props.urlDate }
                  : timelineDate
                  ? { d: timelineDate }
                  : undefined),
              })}
              label={diffView ? txt('hideDiff') : txt('showDiff')}
            />
          )}
          <RegulationStatus
            regulation={regulation}
            urlDate={props.urlDate}
            texts={texts}
          />
          <div className={waterMarkClass}>
            <Text
              as="h1"
              variant="h3"
              marginTop={[2, 3, 4, 5]}
              marginBottom={[2, 4]}
            >
              {/* FIXME: Handle diffing of title (see `./Appendixes.tsx` for an example) */}
              {name} {regulation.title}
            </Text>

            <HTMLDump className={s.bodyText} html={regulation.text} />

            <Appendixes
              legend={txt('appendixesTitle')}
              genericTitle={txt('appendixGenericTitle')}
              appendixes={regulation.appendixes}
            />

            <CommentsBox
              title={txt('commentsTitle')}
              content={regulation.comments}
            />
          </div>{' '}
        </>
      }
      sidebar={
        <Stack space={2}>
          <Button
            preTextIcon="arrowBack"
            preTextIconType="filled"
            size="small"
            type="button"
            variant="text"
            onClick={() => {
              window.history.length > 2
                ? router.back()
                : router.push('/reglugerdir')
            }}
          >
            Til baka
          </Button>

          <RegulationInfoBox regulation={regulation} texts={texts} />
          <RegulationEffectsBox regulation={regulation} texts={texts} />
          <RegulationTimeline regulation={regulation} texts={texts} />
        </Stack>
      }
    />
  )
}
