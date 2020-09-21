// @ts-nocheck
import React, {
  ReactNode,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  Fragment,
  forwardRef,
} from 'react'
import cn from 'classnames'
import { usePopper } from 'react-popper'
import { Icon } from '../Icon/Icon'
import { Button } from '../Button/Button'
import { Stack } from '../Stack/Stack'
import { Tag } from '../Tag/Tag'
import Typography from '../Typography/Typography'
import { Inline } from '../Inline/Inline'

import * as timelineStyles from './Timeline.treat'
import * as eventStyles from './Event.treat'
import ReactDOM from 'react-dom'
import { Box } from '../Box'
import Link from 'next/link'

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
    text: ReactNode
    link: string
  }
}

export interface TimelineProps {
  events: TimelineEvent[]
}

function setDefault<K, V>(map: Map<K, V>, key: K, value: V): V {
  if (!map.has(key)) map.set(key, value)
  return map.get(key) as V
}

const mapEvents = (
  events: TimelineEvent[],
): Map<number, Map<number, TimelineEvent[]>> => {
  events = events.slice().sort((a, b) => b.date.getTime() - a.date.getTime())

  const byYear = new Map()
  for (const event of events) {
    const byMonth = setDefault(byYear, event.date.getFullYear(), new Map())
    setDefault(byMonth, event.date.getMonth(), [] as TimelineEvent[]).push(
      event,
    )
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
  const [visibleModal, setVisibleModal] = useState<string | null>('')

  const eventMap = useMemo(() => mapEvents(events), [events])

  const onResize = useCallback(() => {
    if (!frameRef.current || !innerContainerRef.current) return
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

    if (innerContainerRef.current)
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
                          const bulletLineClass = cn(
                            timelineStyles.bulletLine,
                            {
                              [timelineStyles.bulletLineLarger]: larger,
                            },
                          )
                          return (
                            <div
                              key={eventIndex}
                              className={timelineStyles.eventWrapper}
                            >
                              <div className={timelineStyles.event}>
                                {larger ? (
                                  <Event
                                    event={event}
                                    visibleModal={visibleModal}
                                    modalKey={modalKey}
                                    setVisibleModal={setVisibleModal}
                                  />
                                ) : (
                                  <span className={timelineStyles.eventSimple}>
                                    {event.title}
                                  </span>
                                )}
                              </div>
                              <span className={bulletLineClass}>
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

const Event = ({ event, setVisibleModal, visibleModal, modalKey }) => {
  const portalRef = useRef()
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const [mounted, setMounted] = useState(false)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top-start',
    modifiers: [
      {
        name: 'flip',
        options: {
          rootBoundary: 'document',
          flipVariations: false,
          allowedAutoPlacements: ['top-start'],
        },
      },
    ],
  })
  const isVisible = visibleModal === modalKey
  useEffect(() => {
    portalRef.current = document.querySelector('#__next')
    setMounted(true)
  }, [])

  return (
    <>
      <EventBar
        ref={setReferenceElement}
        onClick={() => {
          setVisibleModal(isVisible ? null : modalKey)
        }}
        event={event}
      />
      {mounted &&
        isVisible &&
        ReactDOM.createPortal(
          <div
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <EventModal event={event} onClose={() => setVisibleModal(null)} />
          </div>,
          portalRef.current,
        )}
    </>
  )
}

interface EventBarProps {
  event: TimelineEvent
  onClick: () => void
}

const EventBar = forwardRef(
  (
    { event, onClick }: EventBarProps,
    ref: React.LegacyRef<HTMLButtonElement>,
  ) => {
    return (
      <button onClick={onClick} className={eventStyles.eventBar} ref={ref}>
        <Box
          className={eventStyles.eventBarTitle}
          background="purple100"
          display="flex"
        >
          <Box className={eventStyles.eventBarIcon}>
            <Icon type="user" color="purple400" width="24" height="24" />
          </Box>
          <Box paddingLeft={2} paddingRight={3}>
            <Typography variant="h5" color="purple400">
              {event.title}
            </Typography>
          </Box>
        </Box>
        {!!event.value && (
          <div className={eventStyles.eventBarStats}>
            <span className={eventStyles.valueWrapper}>
              <span className={eventStyles.value}>
                {formatNumber(event.value)}
              </span>
              {!!event.maxValue && (
                <span className={eventStyles.maxValue}>
                  /{formatNumber(event.maxValue)}
                </span>
              )}
            </span>
            <span className={eventStyles.valueLabel}>
              {event.valueLabel?.split(/[\r\n]+/).map((line, i) => (
                <Fragment key={i}>
                  {line}
                  <br />
                </Fragment>
              ))}
            </span>
          </div>
        )}
      </button>
    )
  },
)

interface EventModalProps {
  event: TimelineEvent
  onClose: () => void
}

const EventModal = forwardRef(
  (
    { event, onClose }: EventModalProps,
    ref: React.LegacyRef<HTMLDivElement>,
  ) => {
    if (!event) {
      return null
    }

    return (
      <div ref={ref} className={eventStyles.eventModal}>
        <Box
          className={eventStyles.eventBarTitle}
          background="white"
          display="inlineFlex"
        >
          <Box className={eventStyles.eventBarIcon}>
            <Icon type="user" color="purple400" width="24" height="24" />
          </Box>
          {!!event.value && (
            <Box
              display="inlineFlex"
              alignItems="center"
              className={eventStyles.nowrap}
              paddingLeft={2}
              paddingRight={4}
            >
              <Typography variant="h2" color="purple400" as="span">
                {formatNumber(event.value)}
              </Typography>
              {!!event.maxValue && (
                <Typography
                  variant="h2"
                  color="purple400"
                  as="span"
                  fontWeight="light"
                >
                  /{formatNumber(event.maxValue)}
                </Typography>
              )}
              <Box marginLeft={1}>
                <Typography
                  variant="eyebrow"
                  color="purple400"
                  fontWeight="semiBold"
                >
                  {event.valueLabel?.split(/[\r\n]+/).map((line, i) => (
                    <Fragment key={i}>
                      {line}
                      <br />
                    </Fragment>
                  ))}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
        <Box padding={6}>
          <button onClick={onClose} className={eventStyles.eventModalClose}>
            <Icon type="close" />
          </button>
          <Stack space={2}>
            <Typography variant="h2" as="h3" color="purple400">
              {event.title}
            </Typography>
            {event.data?.labels && (
              <Inline space={2}>
                {event.data.labels.map((label, index) => (
                  <Tag key={index} label variant="purple" bordered>
                    {label}
                  </Tag>
                ))}
              </Inline>
            )}
            {Boolean(event.data?.text) && event.data.text}
            {event.data?.link && (
              <Link href={event.data.link}>
                <Button variant="text" icon="arrowRight">
                  Lesa meira
                </Button>
              </Link>
            )}
          </Stack>
        </Box>
      </div>
    )
  },
)

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
