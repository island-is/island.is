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
    date: new Date('04/04/2019'),
    title: 'Ferðagjöf',
    amount: 36788,
    maxAmount: 242767,
    valueLabel: 'Sóttar ferðagjafir',
    data: {
      labels: ['Parallel', 'Kosmos & Kaos', 'YAY', 'Andes'],
      markup: `
      <p>Ferðagjöfin er liður í að efla íslenska ferðaþjónustu
      í kjölfar kórónuveirufaraldurs og er ætlað að hvetja
      landsmenn til að ferðast innanlands.</p>

      <h3>Þú færð allar upplýsingar um Ferðagjöfina á ferdalag.is.</h3>

      <p>Allir einstaklingar með lögheimili á Íslandi, fæddir árið
      2002 eða fyrr, fá Ferðagjöf að andvirði 5.000 kr. Gildistími
      Ferðagjafarinnar er til og með 31. desember 2020.</p>`,
      link: 'https://frettabladid.overcastcdn.com/documents/200626.pdf',
    },
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
            </div>
            {usableMonths.map((month, index) => {
              const usableEvents = getUsableEventsInMonthAndYear(year, month)

              return (
                <div key={index}>
                  <div className={styles.section}>
                    <div className={styles.left}>
                      <span className={styles.month}>{months[month]}</span>
                    </div>
                    <div className={styles.right}></div>
                  </div>

                  <div key={index} className={styles.section}>
                    <div className={styles.left}></div>
                    <div className={styles.right}>
                      {usableEvents.map((event, index) => {
                        return (
                          <div key={index} className={styles.event}>
                            <div className={styles.bulletLine}>
                              <BulletLine />
                            </div>

                            {event.title}
                          </div>
                        )
                      })}
                    </div>
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

export default Timeline
