import React, { useLayoutEffect, useRef, useState } from 'react'

import { AlertMessage, AlertMessageType } from './AlertMessage'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'

/**
 * Showcase: many alert messages on one page, collapsed into a single
 * iOS-notification-style pile. The top alert is fully visible, the rest
 * peek out underneath. Clicking the pile (or the button) fans them out
 * into a normal list, and the button collapses them again.
 */
export default {
  title: 'Showcase/AlertMessage stack',
  component: AlertMessage,
}

type Alert = {
  id: string
  type: AlertMessageType
  title: string
  message: string
}

const alerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Ökuskírteinið þitt rennur út 14. október',
    message:
      'Þú getur endurnýjað ökuskírteinið rafrænt á Ísland.is. Það tekur um tvær mínútur.',
  },
  {
    id: '2',
    type: 'info',
    title: 'Nýtt skjal í pósthólfinu',
    message: 'Skatturinn hefur sent þér álagningarseðil fyrir árið 2025.',
  },
  {
    id: '3',
    type: 'error',
    title: 'Greiðsla mistókst',
    message:
      'Ekki tókst að ganga frá greiðslu fyrir umsókn um vegabréf. Reyndu aftur eða veldu annan greiðslumáta.',
  },
  {
    id: '4',
    type: 'success',
    title: 'Umsókn samþykkt',
    message: 'Umsókn þín um fæðingarorlof hefur verið samþykkt.',
  },
  {
    id: '5',
    type: 'default',
    title: 'Viðhald á þjónustu',
    message:
      'Rafræn skilríki verða óaðgengileg aðfaranótt sunnudags milli 02:00 og 04:00.',
  },
]

/** How far each card behind the top one is pushed down, in px. */
const PEEK = 12
/** How much narrower each card behind the top one is, per level. */
const SHRINK = 0.03
/** How many cards peek out beneath the top card. */
const VISIBLE_BEHIND = 2
/** Gap between cards when fanned out, in px. */
const GAP = 16
/** Per-card stagger when fanning out or piling up, in ms. */
const STAGGER = 30

const css = `
.alertStack {
  position: relative;
}
.alertStack--animate {
  transition: height 360ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.alertStack__item {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  border-radius: 8px;
  transform-origin: top center;
}
/*
 * Transitions are enabled only after the first user toggle, so the initial
 * render (and any re-measure, e.g. after fonts load) snaps into place
 * instead of animating.
 */
.alertStack--animate .alertStack__item {
  transition:
    transform 360ms cubic-bezier(0.2, 0.8, 0.2, 1),
    height 360ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 240ms ease;
}
@media (prefers-reduced-motion: reduce) {
  .alertStack, .alertStack__item { transition: none; }
}
`

const AlertMessageStack = ({ items }: { items: Alert[] }) => {
  const [expanded, setExpanded] = useState(false)
  const [animate, setAnimate] = useState(false)
  const toggle = () => {
    setAnimate(true)
    setExpanded((v) => !v)
  }
  const [heights, setHeights] = useState<number[]>([])
  const innerRefs = useRef<(HTMLDivElement | null)[]>([])
  const count = items.length
  const behindCount = Math.min(VISIBLE_BEHIND, count - 1)

  // Measure each card's natural height so every card can be positioned
  // absolutely and slide between its "piled" and "fanned out" positions
  // without ever remounting. Re-measures on resize.
  useLayoutEffect(() => {
    const measure = () =>
      setHeights(
        innerRefs.current.slice(0, count).map((el) => el?.offsetHeight ?? 0),
      )
    measure()
    const observer = new ResizeObserver(measure)
    innerRefs.current
      .slice(0, count)
      .forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [count])

  if (count === 0) return null

  const topHeight = heights[0] ?? 0
  const fannedOffsets = items.reduce<number[]>((acc, _, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + (heights[i - 1] ?? 0) + GAP)
    return acc
  }, [])
  const totalFanned = fannedOffsets[count - 1] + (heights[count - 1] ?? 0)
  const containerHeight = expanded
    ? totalFanned
    : topHeight + behindCount * PEEK

  const toggleLabel = expanded ? 'Stafla' : 'Sýna allar'
  const canToggle = count > 1

  return (
    <Box>
      <style>{css}</style>

      <div
        className={animate ? 'alertStack alertStack--animate' : 'alertStack'}
        role={canToggle ? 'button' : undefined}
        tabIndex={canToggle ? 0 : undefined}
        aria-label={canToggle ? `${toggleLabel} tilkynningar` : undefined}
        aria-expanded={canToggle ? expanded : undefined}
        onClick={() => canToggle && toggle()}
        onKeyDown={(e) => {
          if (canToggle && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            toggle()
          }
        }}
        style={{
          height: containerHeight,
          cursor: canToggle ? 'pointer' : undefined,
          outline: 'none',
          // Nothing paints until the cards are measured, so the first frame
          // is the finished pile rather than a partially laid-out one.
          visibility: heights.length ? undefined : 'hidden',
        }}
      >
        {items.map((alert, index) => {
          // While piled, cards beyond the visible peekers hide under the
          // last visible one so they can slide out from there when fanning.
          const level = Math.min(index, behindCount)
          const hidden = !expanded && index > behindCount
          const transform = expanded
            ? `translateY(${fannedOffsets[index]}px) scale(1)`
            : `translateY(${level * PEEK}px) scale(${1 - level * SHRINK})`
          const delay = expanded
            ? index * STAGGER
            : (count - 1 - index) * STAGGER

          return (
            <div
              key={alert.id}
              className="alertStack__item"
              aria-hidden={!expanded && index > 0 ? true : undefined}
              style={{
                zIndex: count - index,
                // Piled cards adopt the top card's height so only their
                // bottom edge peeks out. Fanned cards use their own height.
                height: expanded ? heights[index] : topHeight,
                transform,
                opacity: hidden ? 0 : 1,
                // Only while animating: a delay on its own still defers the
                // style change even with a 0s transition, which would make the
                // cards pop in one by one on first render.
                transitionDelay: animate ? `${delay}ms` : undefined,
                pointerEvents: expanded || index === 0 ? undefined : 'none',
              }}
            >
              <div
                ref={(el) => {
                  innerRefs.current[index] = el
                }}
              >
                <AlertMessage
                  type={alert.type}
                  title={alert.title}
                  message={alert.message}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/*
       * Toggle: bottom-right of the stack, in normal flow, so it rides along
       * as the stack height animates.
       */}
      {canToggle && (
        <Box display="flex" justifyContent="flexEnd" marginTop={1}>
          <Button
            variant="text"
            size="small"
            icon={expanded ? 'chevronUp' : 'chevronDown'}
            onClick={toggle}
          >
            {toggleLabel}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export const Stacked = () => (
  <ContentBlock width="medium">
    <AlertMessageStack items={alerts} />
  </ContentBlock>
)

export const TwoAlerts = () => (
  <ContentBlock width="medium">
    <AlertMessageStack items={alerts.slice(0, 2)} />
  </ContentBlock>
)

export const SingleAlert = () => (
  <ContentBlock width="medium">
    <AlertMessageStack items={alerts.slice(0, 1)} />
  </ContentBlock>
)

export const InPageContext = () => (
  <ContentBlock width="medium">
    <Stack space={4}>
      <Box>
        <Text variant="h1" as="h1" marginBottom={1}>
          Mínar síður
        </Text>
        <Text>
          Hér sérðu yfirlit yfir þín mál, skjöl og tilkynningar frá hinu
          opinbera.
        </Text>
      </Box>
      <AlertMessageStack items={alerts} />
      <Box
        padding={4}
        borderRadius="large"
        background="blue100"
        borderColor="blue200"
        borderWidth="standard"
      >
        <Text variant="h3" marginBottom={1}>
          Efni síðunnar
        </Text>
        <Text>
          Innihald fyrir neðan tilkynningarnar. Staflinn tekur pláss eins og ein
          tilkynning þar til hann er opnaður.
        </Text>
      </Box>
    </Stack>
  </ContentBlock>
)
