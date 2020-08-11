import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  Fragment,
} from 'react'
import cn from 'classnames'
import { Icon } from '../Icon/Icon'
import { Button } from '../Button/Button'
import { Stack } from '../Stack/Stack'
import { Tag } from '../Tag/Tag'
import Typography from '../Typography/Typography'
import { Inline } from '../Inline/Inline'

import * as timelineStyles from './Timeline.treat'
import * as eventStyles from './Event.treat'

const formatNumber = (value: number) =>
  value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

const months = [
  'Janúar',
  'Febrúar',
  'Mars',
  'Apríl',
  'Maí',
  'Júní',
  'Júlí',
  'Ágúst',
  'September',
  'Október',
  'Nóvember',
  'Desember',
]

export type TimelineEvent = {
  date: Date
  title: string
  value?: number
  maxValue?: number
  valueLabel?: string
  data?: {
    labels: string[]
    text: string
    link: string
  }
}

export interface TimelineProps {
  events: TimelineEvent[]
}

function setDefault<K, V>(map: Map<K, V>, key: K, value: V): V {
  if (!map.has(key)) map.set(key, value)
  return map.get(key)
}

const mapEvents = (
  events: TimelineEvent[],
): Map<number, Map<number, TimelineEvent[]>> => {
  events = events.slice().sort((a, b) => b.date.getTime() - a.date.getTime())

  const byYear = new Map()
  for (const event of events) {
    const byMonth = setDefault(byYear, event.date.getFullYear(), new Map())
    setDefault(byMonth, event.date.getMonth(), []).push(event)
  }

  return byYear
}

export const Timeline = ({ events }: TimelineProps) => {
  const frameRef = useRef<HTMLDivElement>(null)
  const innerContainerRef = useRef<HTMLDivElement>(null)

  const [containerHeight, setContainerHeight] = useState(0)
  const [frameHeight, setFrameHeight] = useState(0)
  const [frameJump, setFrameJump] = useState(0)
  const [jumpIndex, setJumpIndex] = useState(0)
  const [visibleModal, setVisibleModal] = useState('')

  const eventMap = useMemo(() => mapEvents(events), [events])

  const onResize = useCallback(() => {
    setFrameJump(frameRef.current.offsetHeight / 2)
    setContainerHeight(innerContainerRef.current.offsetHeight)
    setFrameHeight(frameRef.current.offsetHeight)
  }, [innerContainerRef, frameRef, setFrameJump])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  const jumpTo = (dir: 'prev' | 'next') => {
    setVisibleModal(null)
    const jump = frameJump * jumpIndex
    const diff = containerHeight - frameHeight

    if (dir === 'prev' && jumpIndex > 0) {
      setJumpIndex(jumpIndex - 1)
    } else if (dir === 'next' && jump < diff) {
      setJumpIndex(jumpIndex + 1)
    }
  }

  useEffect(() => {
    let jump = frameJump * jumpIndex
    const diff = containerHeight - frameHeight

    if (jump > containerHeight - frameHeight) {
      jump = diff
    }

    innerContainerRef.current.style.transform = `translateY(-${jump}px)`
  }, [frameJump, jumpIndex, containerHeight, frameHeight])

  return (
    <div className={timelineStyles.container}>
      <ArrowButton type="prev" onClick={() => jumpTo('prev')} />
      <ArrowButton type="next" onClick={() => jumpTo('next')} />
      <div ref={frameRef} className={timelineStyles.frame}>
        <div ref={innerContainerRef} className={timelineStyles.innerContainer}>
          {Array.from(eventMap.entries(), ([year, eventsByMonth]) => (
            <div key={year} className={timelineStyles.yearContainer}>
              <div className={timelineStyles.section}>
                <div className={timelineStyles.left}>
                  <span
                    className={cn(
                      timelineStyles.year,
                      timelineStyles.leftLabel,
                    )}
                  >
                    {year}
                  </span>
                </div>
                <div className={timelineStyles.right}>&nbsp;</div>
              </div>
              {Array.from(eventsByMonth.entries(), ([month, monthEvents]) => (
                <div key={month} className={timelineStyles.monthContainer}>
                  <div className={timelineStyles.section}>
                    <div className={timelineStyles.left}>
                      <span
                        className={cn(
                          timelineStyles.month,
                          timelineStyles.leftLabel,
                        )}
                      >
                        {months[month]}
                      </span>
                    </div>
                    <div className={timelineStyles.right}>&nbsp;</div>
                  </div>

                  <div className={timelineStyles.section}>
                    <div className={timelineStyles.left}>&nbsp;</div>
                    <div className={timelineStyles.right}>
                      <div className={timelineStyles.eventsContainer}>
                        {monthEvents.map((event, eventIndex) => {
                          const larger = Boolean(event.data)
                          const modalKey = `modal-${year}-${month}-${eventIndex}`
                          const isVisible = visibleModal === modalKey

                          return (
                            <div
                              key={eventIndex}
                              className={timelineStyles.eventWrapper}
                            >
                              <div className={timelineStyles.event}>
                                {larger ? (
                                  <>
                                    <EventBar
                                      onClick={() => {
                                        setVisibleModal(
                                          isVisible ? null : modalKey,
                                        )
                                      }}
                                      event={event}
                                    />
                                    <EventModal
                                      event={event}
                                      visible={isVisible}
                                      onClose={() => setVisibleModal(null)}
                                    />
                                  </>
                                ) : (
                                  <span className={timelineStyles.eventSimple}>
                                    {event.title}
                                  </span>
                                )}
                              </div>
                              <span
                                className={cn(timelineStyles.bulletLine, {
                                  [timelineStyles.bulletLineLarger]: larger,
                                })}
                              >
                                <BulletLine selected={isVisible} />
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface EventBarProps {
  event: TimelineEvent
  onClick: () => void
}

const EventBar = ({ event, onClick }: EventBarProps) => {
  return (
    <>
      <button onClick={onClick} className={eventStyles.eventBar}>
        <div className={eventStyles.eventBarTitle}>
          <div className={eventStyles.eventBarIcon}>
            <Icon type="user" color="purple400" width="24" />
          </div>
          <span className={eventStyles.title}>{event.title}</span>
        </div>
        {event.value && (
          <div className={eventStyles.eventBarStats}>
            <span className={eventStyles.valueWrapper}>
              <span className={eventStyles.value}>
                {formatNumber(event.value)}
              </span>
              <span className={eventStyles.maxValue}>
                /{formatNumber(event.maxValue)}
              </span>
            </span>
            <span className={eventStyles.valueLabel}>
              {event.valueLabel.split(/[\r\n]+/).map((line, i) => (
                <Fragment key={i}>
                  {line}
                  <br />
                </Fragment>
              ))}
            </span>
          </div>
        )}
      </button>
    </>
  )
}

interface EventModalProps {
  event: TimelineEvent
  visible: boolean
  onClose: () => void
}

const EventModal = ({ event, visible, onClose }: EventModalProps) => {
  if (!event) {
    return null
  }

  return (
    <div
      className={cn(eventStyles.eventModal, {
        [eventStyles.eventModalVisible]: visible,
      })}
    >
      <div className={eventStyles.eventBarIcon}>
        <Icon type="user" color="purple400" width="24" />
      </div>
      <div className={eventStyles.eventModalContent}>
        <button onClick={onClose} className={eventStyles.eventModalClose}>
          <Icon type="close" />
        </button>
        <Stack space={3}>
          <Typography variant="h2" as="h3" color="purple400">
            {event.title}
          </Typography>
          {event.data?.labels && (
            <Inline space={2}>
              {event.data.labels.map((label) => (
                <Tag label>{label}</Tag>
              ))}
            </Inline>
          )}
          <Typography variant="p" as="p">
            {event.data.text}
          </Typography>
          <Button variant="text" icon="arrowRight">
            Lesa meira
          </Button>
        </Stack>
      </div>
    </div>
  )
}

const BulletLine = ({ selected = false }: { selected?: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="126"
      height="24"
      fill="none"
      viewBox="0 0 126 24"
    >
      <path
        fill={selected ? '#ff0050' : '#99c0ff'}
        fillRule="evenodd"
        d="M118.126 13A4.002 4.002 0 00126 12a4 4 0 00-8 0H24c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12c6.29 0 11.45-4.84 11.959-11h94.167zM8 12a4 4 0 108 0 4 4 0 00-8 0z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}

interface ArrowButtonProps {
  type: 'prev' | 'next'
  onClick: () => void
}

const ArrowButton = ({ type = 'prev', onClick }: ArrowButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        timelineStyles.arrowButton,
        timelineStyles.arrowButtonTypes[type],
      )}
    >
      <Icon type="arrowLeft" color="blue400" width="15" />
    </button>
  )
}

export default Timeline
