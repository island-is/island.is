import React, { useState, useRef, useEffect, useCallback } from 'react'
import cn from 'classnames'
import { Icon } from '../Icon/Icon'
import { Button } from '../Button/Button'
import { Stack } from '../Stack/Stack'
import { Tag } from '../Tag/Tag'
import Typography from '../Typography/Typography'
import { Inline } from '../Inline/Inline'

import * as timelineStyles from './Timeline.treat'
import * as eventStyles from './Event.treat'

/* eslint-disable-next-line */
export interface TimelineProps {}

const renderValue = (value) =>
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
  'Oktober',
  'Nóvember',
  'Desember',
]

const initialState = [
  {
    date: new Date('05/05/2019'),
    title: 'Rásfundur: 5 teymi',
  },
  {
    date: new Date('04/08/2019'),
    title: 'Ytri vefur: BETA',
  },
  {
    date: new Date('04/04/2019'),
    title: 'Ferðagjöf',
    value: 36788,
    maxValue: 242767,
    valueLabel: 'Sóttar ferðagjafir',
    data: {
      labels: ['Parallel', 'Kosmos & Kaos', 'YAY', 'Andes'],
      text:
        'Ferðagjöfin er liður í að efla íslenska ferðaþjónustu í kjölfar kórónuveirufaraldurs og er ætlað að hvetja landsmenn til að ferðast innanlands.',
      link: 'https://frettabladid.overcastcdn.com/documents/200626.pdf',
    },
  },
  {
    date: new Date('04/23/2019'),
    title: 'Eitthvað sniðugt: OMEGA',
  },
  {
    date: new Date('07/07/2019'),
    title: 'Ferðagjöf',
    value: 36788,
    maxValue: 242767,
    valueLabel: 'Sóttar ferðagjafir',
    data: {
      labels: ['Parallel', 'Kosmos & Kaos', 'YAY', 'Andes'],
      text:
        'Ferðagjöfin er liður í að efla íslenska ferðaþjónustu í kjölfar kórónuveirufaraldurs og er ætlað að hvetja landsmenn til að ferðast innanlands.',
      link: 'https://frettabladid.overcastcdn.com/documents/200626.pdf',
    },
  },
  {
    date: new Date('04/20/2019'),
    title: 'Eitthvað sniðugt: OMEGA',
  },
  {
    date: new Date('03/09/2018'),
    title: 'Margt gerðist hér!',
  },
  {
    date: new Date('03/10/2018'),
    title: 'Meira hér!',
  },
  {
    date: new Date('05/05/2017'),
    title: 'Rásfundur: 5 teymi',
  },
  {
    date: new Date('04/08/2017'),
    title: 'Ytri vefur: BETA',
  },
  {
    date: new Date('04/04/2017'),
    title: 'Ferðagjöf',
    value: 36788,
    maxValue: 242767,
    valueLabel: 'Sóttar ferðagjafir',
    data: {
      labels: ['Parallel', 'Kosmos & Kaos', 'YAY', 'Andes'],
      text:
        'Ferðagjöfin er liður í að efla íslenska ferðaþjónustu í kjölfar kórónuveirufaraldurs og er ætlað að hvetja landsmenn til að ferðast innanlands.',
      link: 'https://frettabladid.overcastcdn.com/documents/200626.pdf',
    },
  },
  {
    date: new Date('02/02/2020'),
    title: 'Viðspyrna',
    data: {
      labels: ['Parallel', 'Kosmos & Kaos', 'YAY', 'Andes'],
      text:
        'Ferðagjöfin er liður í að efla íslenska ferðaþjónustu í kjölfar kórónuveirufaraldurs og er ætlað að hvetja landsmenn til að ferðast innanlands.',
      link: 'https://frettabladid.overcastcdn.com/documents/200626.pdf',
    },
  },
  {
    date: new Date('04/23/2017'),
    title: 'Eitthvað sniðugt: OMEGA',
  },
  {
    date: new Date('03/09/2016'),
    title: 'Margt gerðist hér!',
  },
  {
    date: new Date('03/10/2016'),
    title: 'Meira hér!',
  },
  {
    date: new Date('04/04/2015'),
    title: 'Ferðagjöf',
    value: 36788,
    maxValue: 242767,
    valueLabel: 'Sóttar ferðagjafir',
    data: {
      labels: ['Parallel', 'Kosmos & Kaos', 'YAY', 'Andes'],
      text:
        'Ferðagjöfin er liður í að efla íslenska ferðaþjónustu í kjölfar kórónuveirufaraldurs og er ætlað að hvetja landsmenn til að ferðast innanlands.',
      link: 'https://frettabladid.overcastcdn.com/documents/200626.pdf',
    },
  },
  {
    date: new Date('02/02/2015'),
    title: 'Viðspyrna',
    data: {
      labels: ['Parallel', 'Kosmos & Kaos', 'YAY', 'Andes'],
      text:
        'Ferðagjöfin er liður í að efla íslenska ferðaþjónustu í kjölfar kórónuveirufaraldurs og er ætlað að hvetja landsmenn til að ferðast innanlands.',
      link: 'https://frettabladid.overcastcdn.com/documents/200626.pdf',
    },
  },
  {
    date: new Date('04/23/2015'),
    title: 'Eitthvað sniðugt: OMEGA',
  },
  {
    date: new Date('03/09/2015'),
    title: 'Margt gerðist hér!',
  },
  {
    date: new Date('03/10/2015'),
    title: 'Meira hér!',
  },
].sort((a, b) => b.date.getTime() - a.date.getTime())

export const Timeline = (props: TimelineProps) => {
  const frameRef = useRef<HTMLDivElement>(null)
  const innerContainerRef = useRef<HTMLDivElement>(null)

  const [events, setEvents] = useState(initialState)
  const [containerHeight, setContainerHeight] = useState(0)
  const [frameHeight, setFrameHeight] = useState(0)
  const [frameJump, setFrameJump] = useState(0)
  const [jumpIndex, setJumpIndex] = useState(0)
  const [visibleModal, setVisibleModal] = useState(null)

  const usableYears = events.reduce((usableYears, item) => {
    const eventYear = item.date.getFullYear()

    if (usableYears.indexOf(eventYear) < 0) {
      usableYears.push(eventYear)
    }

    return usableYears
  }, [])

  const getUsableMonthsInYear = (year) =>
    events.reduce((usableMonths, item) => {
      const eventYear = item.date.getFullYear()

      if (eventYear === year) {
        const month = item.date.getMonth()

        if (usableMonths.indexOf(month) < 0) {
          usableMonths.push(month)
        }
      }

      return usableMonths
    }, [])

  const getUsableEventsInMonthAndYear = (year, month) =>
    events.filter(
      (event) =>
        event.date.getFullYear() === year && event.date.getMonth() === month,
    )

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

  const jumpTo = (dir) => {
    setVisibleModal(null)
    const jump = frameJump * jumpIndex
    const diff = containerHeight - frameHeight

    switch (dir) {
      case 'prev':
        if (jumpIndex !== 0) {
          setJumpIndex(jumpIndex - 1)
        }
        break
      case 'next':
        if (jump < diff) {
          setJumpIndex(jumpIndex + 1)
        }
        break
      default:
        break
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
          {usableYears.map((year, yearIndex) => {
            const usableMonths = getUsableMonthsInYear(year)

            return (
              <div key={yearIndex} className={timelineStyles.yearContainer}>
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
                {usableMonths.map((month, monthIndex) => {
                  const usableEvents = getUsableEventsInMonthAndYear(
                    year,
                    month,
                  )

                  return (
                    <div
                      key={monthIndex}
                      className={timelineStyles.monthContainer}
                    >
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
                            {usableEvents.map((event, eventIndex) => {
                              const larger = Boolean(event.data)
                              const modalKey = `modal-${yearIndex}-${monthIndex}-${eventIndex}`
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
                                      <span
                                        className={timelineStyles.eventSimple}
                                      >
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
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface EventBarProps {
  event: any // TODO: Create a type to use here...
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
                {renderValue(event.value)}
              </span>
              <span className={eventStyles.maxValue}>
                /{renderValue(event.maxValue)}
              </span>
            </span>
            <span className={eventStyles.valueLabel}>{event.valueLabel}</span>
          </div>
        )}
      </button>
    </>
  )
}

interface EventModalProps {
  event: any // TODO: Create a type to use here...
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
              {event.data.labels.map((label, index) => (
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

type ArrowButtonTypes = 'prev' | 'next'

interface ArrowButtonProps {
  type: ArrowButtonTypes
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
