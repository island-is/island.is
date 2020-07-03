import React, { useState } from 'react'

import * as styles from './Timeline.treat'

/* eslint-disable-next-line */
export interface TimelineProps {}

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
    date: new Date('04/23/2019'),
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
].sort((a, b) => b.date.getTime() - a.date.getTime())

export const Timeline = (props: TimelineProps) => {
  const [events, setEvents] = useState(initialState)

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

  return (
    <div className={styles.container}>
      {usableYears.map((year, index) => {
        const usableMonths = getUsableMonthsInYear(year)

        return (
          <div key={index}>
            <div className={styles.section}>
              <div className={styles.left}>{year}</div>
              <div className={styles.right}>right side</div>
            </div>
            {usableMonths.map((month, index) => {
              const usableEvents = getUsableEventsInMonthAndYear(year, month)

              return (
                <div key={index} className={styles.section}>
                  <div className={styles.left}>{months[month]}</div>
                  <div className={styles.right}>
                    {usableEvents.map((event, index) => {
                      return (
                        <div key={index} className={styles.event}>
                          {event.title}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default Timeline
