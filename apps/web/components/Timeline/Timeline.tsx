import React, {
  ReactNode,
  useState,
  useRef,
  useEffect,
  useMemo,
  Fragment,
  forwardRef,
} from 'react'
import cn from 'classnames'
import { usePopper } from 'react-popper'

import * as timelineStyles from './Timeline.css'
import * as eventStyles from './Event.css'
import ReactDOM from 'react-dom'
import {
  Box,
  Icon,
  Button,
  Stack,
  Tag,
  Text,
  Inline,
} from '@island.is/island-ui/core'
import Link from 'next/link'

const formatNumber = (value: number) =>
  value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

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
  getMonthByIndex: (idx: number) => string
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

export const Timeline = ({ events, getMonthByIndex }: TimelineProps) => {
  const frameRef = useRef<HTMLDivElement>(null)
  const entriesParentRef = useRef<HTMLDivElement>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevButtonDisabled, setPrevButtonDisabled] = useState(false)
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false)

  const [visibleModal, setVisibleModal] = useState<string | null>('')

  const eventMap = useMemo(() => mapEvents(events), [events])

  const getPrevIndex = () => (currentIndex <= 0 ? 0 : currentIndex - 1)
  const getNextIndex = () =>
    currentIndex >= entriesParentRef.current.children.length - 1
      ? currentIndex
      : currentIndex + 1

  /**
   * Move timeline to DOM node index (years and months)
   * @param index    DOM index
   * @param behavior  type of scroll behavior
   */
  const moveTimeline = (
    index: number,
    behavior: 'smooth' | 'auto' = 'smooth',
  ) => {
    const child = entriesParentRef.current.children[index] as HTMLElement
    frameRef.current.scrollTo({
      top: child.offsetTop,
      behavior,
    })
    const scrollReachedTop = child.offsetTop <= 0
    const scrollReachedBottom =
      frameRef.current.scrollHeight - child.offsetTop <=
      frameRef.current.clientHeight

    setPrevButtonDisabled(scrollReachedTop)
    setNextButtonDisabled(scrollReachedBottom)
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (frameRef.current && entriesParentRef.current?.children?.length > 0) {
      /**
       * Scroll to current month vertical and horizontal
       */
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()

      // find current month
      const months = Array.from(
        entriesParentRef.current.children,
      ) as Array<HTMLElement>
      const { currentMonthIndex, currentMonth } = months.reduce<{
        currentMonthIndex: number
        currentMonth: HTMLElement | null
      }>(
        (acc, current, index) => {
          if (current.dataset.date === `${year}/${month}`) {
            acc.currentMonthIndex = index
            acc.currentMonth = current
          }
          return acc
        },
        {
          currentMonthIndex: 0,
          currentMonth: null,
        },
      )
      // padding based on mobile gutter
      const leftPadding = 24
      frameRef.current.scrollLeft =
        currentMonth && currentMonth.offsetLeft
          ? currentMonth.offsetLeft - leftPadding
          : undefined
      moveTimeline(currentMonthIndex)
    }
  }, [])

  return (
    <div className={timelineStyles.container}>
      <ArrowButton
        type="prev"
        disabled={prevButtonDisabled}
        onClick={() => {
          moveTimeline(getPrevIndex())
        }}
      />
      <ArrowButton
        type="next"
        disabled={nextButtonDisabled}
        onClick={() => {
          moveTimeline(getNextIndex())
        }}
      />
      <div ref={frameRef} className={timelineStyles.frame}>
        <div className={timelineStyles.innerContainer}>
          <div ref={entriesParentRef} className={timelineStyles.yearContainer}>
            {Array.from(eventMap.entries(), ([year, eventsByMonth]) => (
              <Fragment key={year}>
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
                  <div
                    key={month}
                    className={timelineStyles.monthContainer}
                    data-date={`${year}/${month}`}
                  >
                    <div className={timelineStyles.section}>
                      <div className={timelineStyles.left}>
                        <span
                          className={cn(
                            timelineStyles.month,
                            timelineStyles.leftLabel,
                          )}
                        >
                          {getMonthByIndex(month)}
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
                                    <span
                                      className={timelineStyles.eventSimple}
                                    >
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
              </Fragment>
            ))}
          </div>
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
          <Fragment>
            <Box
              display={['none', 'none', 'none', 'block']}
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
            >
              <EventModal event={event} onClose={() => setVisibleModal(null)} />
            </Box>
            <Box
              display={['flex', 'flex', 'flex', 'none']}
              position="fixed"
              top={0}
              bottom={0}
              left={0}
              right={0}
              overflow="auto"
              padding={3}
              className={eventStyles.mobileModalContainer}
            >
              <EventModal event={event} onClose={() => setVisibleModal(null)} />
            </Box>
          </Fragment>,
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
          component="span"
          className={eventStyles.eventBarTitle}
          background="purple100"
          display="flex"
        >
          <Box component="span" className={eventStyles.eventBarIcon}>
            <Icon type="filled" icon="person" color="purple400" size="medium" />
          </Box>
          <Box component="span" paddingLeft={2} paddingRight={3}>
            <Text as="span" variant="h5" color="purple400">
              {event.title}
            </Text>
          </Box>
        </Box>
        {!!event.value && (
          <span className={eventStyles.eventBarStats}>
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
          </span>
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
            <Icon type="filled" icon="person" color="purple400" size="medium" />
          </Box>
          {!!event.value && (
            <Box
              display="inlineFlex"
              alignItems="center"
              className={eventStyles.nowrap}
              paddingLeft={2}
              paddingRight={4}
            >
              <Text variant="h2" color="purple400" as="span">
                {formatNumber(event.value)}
              </Text>
              {!!event.maxValue && (
                <Text
                  variant="h2"
                  color="purple400"
                  as="span"
                  fontWeight="light"
                >
                  /{formatNumber(event.maxValue)}
                </Text>
              )}
              <Box marginLeft={1}>
                <Text variant="eyebrow" color="purple400" fontWeight="semiBold">
                  {event.valueLabel?.split(/[\r\n]+/).map((line, i) => (
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
            {event.data?.labels && (
              <Inline space={2}>
                {event.data.labels.map((label, index) => (
                  <Tag key={index} variant="purple" outlined>
                    {label}
                  </Tag>
                ))}
              </Inline>
            )}
            {Boolean(event.data?.text) && event.data.text}
            {event.data?.link && (
              <Link href={event.data.link}>
                <Button variant="text" icon="arrowForward">
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

export default Timeline
