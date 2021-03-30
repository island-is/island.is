import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  forwardRef,
  Fragment,
} from 'react'
import {
  Box,
  Button,
  GridContainer,
  Icon,
  Inline,
  ModalBase,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { TimelineSlice as Timeline } from '@island.is/web/graphql/schema'
import cn from 'classnames'
import * as timelineStyles from './TimelineSlice.treat'
import * as eventStyles from './Event.treat'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import Link from 'next/link'
import ReactDOM from 'react-dom'
import {
  renderSlices,
  richText,
  SliceType,
} from '@island.is/island-ui/contentful'

interface SliceProps {
  slice: Timeline
}

function setDefault<K, V>(map: Map<K, V>, key: K, value: V): V {
  if (!map.has(key)) map.set(key, value)
  return map.get(key) as V
}

const mapEvents = (
  events: Timeline['events'],
): Map<number, Map<number, Timeline['events']>> => {
  events = events
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const byYear = new Map()
  for (const event of events) {
    const byMonth = setDefault(
      byYear,
      new Date(event.date).getFullYear(),
      new Map(),
    )
    setDefault(
      byMonth,
      new Date(event.date).getMonth(),
      [] as Timeline['events'],
    ).push(event)
  }

  return byYear
}

const renderTimeline = (eventMap) => {
  const { getMonthByIndex } = useDateUtils()

  let i = 0
  let offset = 0
  let lastTimestamp = 0
  let lastYear = 0
  let items = []

  Array.from(eventMap.entries(), ([year, eventsByMonth]) => {
    Array.from(eventsByMonth.entries(), ([month, monthEvents]) => {
      offset += 100
      items.push(
        <MonthItem
          month={getMonthByIndex(month)}
          year={lastYear !== year && year}
          offset={offset}
        />,
      )
      lastYear = year
      monthEvents.map((event) => {
        const timestamp = new Date(event.date).getTime()
        offset += Math.max(
          90,
          Math.min(160, (lastTimestamp - timestamp) / 4320000),
        )
        items.push(
          <>
            <TimelineItem
              event={event}
              offset={offset}
              index={i}
              detailed={!!event.label}
            />
            <BulletLine
              offset={offset}
              angle={90 + (i % 2) * 180}
              length={i % 4 > 1 ? 'long' : 'short'}
            />
          </>,
        )
        i++
        lastTimestamp = timestamp
      })
    })
  })

  items.push(
    <div
      style={{
        position: 'absolute',
        width: offset + 150,
        height: '10px',
        background:
          'linear-gradient(287.27deg, #0161FD 30.04%, #3F46D2 43.89%, #812EA4 58.3%, #C21578 72.7%, #FD0050 85.44%)',
        top: 345,
      }}
    ></div>,
  )
  return items
}

export const TimelineSlice: React.FC<SliceProps> = ({ slice }) => {
  const frameRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(0)

  const moveTimeline = (dir: 'left' | 'right') => {
    if (dir === 'right') {
      setPosition(position + 500)
    } else {
      setPosition(position - 500)
    }
  }

  useEffect(() => {
    frameRef.current.scrollTo({
      left: position,
      behavior: 'smooth',
    })
  })

  const eventMap = useMemo(() => mapEvents(slice.events), [slice.events])

  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <GridContainer>
        <Box paddingBottom={2}>
          <Text paddingBottom={4}>{slice.title}</Text>
          <div style={{ height: 700 }}>
            <div
              style={{
                position: 'absolute',
                left: -80,
                width: 1100,
                height: 700,
              }}
            >
              <ArrowButtonShadow type="prev" />
              <ArrowButtonShadow type="next" />
              <ArrowButton
                type="prev"
                onClick={() => moveTimeline('left')}
                disabled={false}
              />
              <ArrowButton
                type="next"
                onClick={() => moveTimeline('right')}
                disabled={false}
              />
              <div
                ref={frameRef}
                style={{
                  width: '100%',
                  overflowX: 'hidden',
                  position: 'absolute',
                  height: 700,
                }}
              >
                {renderTimeline(eventMap)}
              </div>
            </div>
          </div>
        </Box>
      </GridContainer>
    </section>
  )
}

interface ArrowButtonShadowProps {
  type: 'prev' | 'next'
}

const ArrowButtonShadow = ({ type }: ArrowButtonShadowProps) => {
  return <div className={timelineStyles.arrowButtonShadow[type]}></div>
}

interface ArrowButtonProps {
  type: 'prev' | 'next'
  onClick: () => void
  disabled: boolean
}

const ArrowButton = ({
  type = 'prev',
  onClick,
  disabled,
}: ArrowButtonProps) => {
  return (
    <Box
      className={cn(
        timelineStyles.arrowButton,
        timelineStyles.arrowButtonTypes[type],
      )}
    >
      <Button
        colorScheme="negative"
        circle
        icon="arrowBack"
        onClick={onClick}
      />
    </Box>
  )
}

const TimelineItem = ({ event, offset, index, detailed }) => {
  const styles = [{ bottom: 136 }, { top: 136 }, { bottom: 20 }, { top: 20 }]
  const [visible, setVisible] = useState(false)

  const portalRef = useRef()
  useEffect(() => {
    portalRef.current = document.querySelector('#__next')
  })

  return detailed ? (
    <div
      className={timelineStyles.item}
      style={{
        left: offset - 158,
        alignItems: index % 2 ? 'flex-end' : 'flex-start',
        ...styles[index % 4],
      }}
    >
      <div
        className={timelineStyles.detailedItem}
        onClick={() => setVisible(true)}
      >
        <div className={timelineStyles.itemText}>{event.title}</div>
      </div>
      {visible &&
        ReactDOM.createPortal(
          <ModalBase baseId="eventDetails" isVisible={true}>
            <EventModal event={event} onClose={() => setVisible(false)} />
          </ModalBase>,
          portalRef.current,
        )}
    </div>
  ) : (
    <div
      className={timelineStyles.item}
      style={{ left: offset - 158, ...styles[index % 4] }}
    >
      <div
        className={timelineStyles.basicItem}
        style={{ alignItems: index % 2 ? 'flex-end' : 'flex-start' }}
      >
        <div className={timelineStyles.itemText}>{event.title}</div>
      </div>
    </div>
  )
}

const BulletLine = ({
  offset,
  angle,
  length = 'short',
  selected = false,
}: {
  offset: number
  angle: number
  length: 'short' | 'long'
  selected?: boolean
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 338,
        left: offset - 12,
        transformOrigin: '12px 12px',
        transform: `rotate(${angle}deg)`,
        zIndex: 1,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="244"
        height="24"
        fill="none"
        viewBox="0 0 244 24"
      >
        <path
          fill={selected ? '#ff0050' : '#99c0ff'}
          fillRule="evenodd"
          d={
            length === 'short'
              ? 'M118.126 13A4.002 4.002 0 00126 12a4 4 0 00-8 0H24c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12c6.29 0 11.45-4.84 11.959-11h94.167zM8 12a4 4 0 108 0 4 4 0 00-8 0z'
              : 'M234.126 13c1.185 4.535 7.86 3.687 7.874-1 0-5.333-8-5.333-8 0H24c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12c6.29 0 11.45-4.84 11.959-11zM8 12c0 5.333 8 5.333 8 0s-8-5.333-8 0z'
          }
          clipRule="evenodd"
        ></path>
      </svg>
    </div>
  )
}

const MonthItem = ({ month, offset, year = '' }) => {
  return (
    <div
      className={timelineStyles.monthItem}
      style={{ bottom: 370, left: offset }}
    >
      <Text color="blue600" variant="h2">
        {year}
      </Text>
      <Text color="blue600" variant="eyebrow">
        {month}
      </Text>
    </div>
  )
}

interface EventModalProps {
  event: Timeline['events'][0]
  onClose: () => void
}

const formatNumber = (value: number) =>
  value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

const EventModal = forwardRef(({ event, onClose }: EventModalProps) => {
  if (!event) {
    return null
  }
  return (
    <div className={eventStyles.eventModal}>
      <Box
        className={eventStyles.eventBarTitle}
        background="white"
        display="inlineFlex"
      >
        <Box className={eventStyles.eventBarIcon}>
          <Icon type="filled" icon="person" color="purple400" size="medium" />
        </Box>
        {!!event.numerator && (
          <Box
            display="inlineFlex"
            alignItems="center"
            className={eventStyles.nowrap}
            paddingLeft={2}
            paddingRight={4}
          >
            <Text variant="h2" color="purple400" as="span">
              {formatNumber(event.numerator)}
            </Text>
            {!!event.denominator && (
              <Text variant="h2" color="purple400" as="span" fontWeight="light">
                /{formatNumber(event.denominator)}
              </Text>
            )}
            <Box marginLeft={1}>
              <Text variant="eyebrow" color="purple400" fontWeight="semiBold">
                {event.label?.split(/[\r\n]+/).map((line, i) => (
                  <Fragment key={i}>
                    {line}
                    <br />
                  </Fragment>
                ))}
              </Text>
            </Box>
          </Box>
        )}
      </Box>
      <Box padding={6}>
        <Box className={eventStyles.eventModalClose}>
          <Button
            circle
            colorScheme="negative"
            icon="close"
            onClick={onClose}
          />
        </Box>
        <Stack space={2}>
          <Text variant="h2" as="h3" color="purple400">
            {event.title}
          </Text>
          {event.tags && (
            <Inline space={2}>
              {event.tags.map((label, index) => (
                <Tag key={index} variant="purple" outlined>
                  {label}
                </Tag>
              ))}
            </Inline>
          )}
          {Boolean(event.body) && renderSlices(event.body as SliceType)}
          {event.link && (
            <Link href={event.link}>
              <Button variant="text" icon="arrowForward">
                Lesa meira
              </Button>
            </Link>
          )}
        </Stack>
      </Box>
    </div>
  )
})
