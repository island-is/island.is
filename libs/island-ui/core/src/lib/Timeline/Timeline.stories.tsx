import React from 'react'
import { Timeline, TimelineEvent } from './Timeline'

const events: TimelineEvent[] = [
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
]

export default {
  title: 'Components/Timeline',
  component: Timeline,
}

export const Default = () => <Timeline events={events} />
