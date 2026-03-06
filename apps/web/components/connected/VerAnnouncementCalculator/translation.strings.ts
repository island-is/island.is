import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  startDateLabel: {
    id: 'web.VerAnnouncementCalculator:startDateLabel',
    defaultMessage: 'Upphaf verks',
    description: 'Start date input label',
  },
  endDateLabel: {
    id: 'web.VerAnnouncementCalculator:endDateLabel',
    defaultMessage: 'Lok verks',
    description: 'End date input label',
  },
  countLabel: {
    id: 'web.VerAnnouncementCalculator:countLabel',
    defaultMessage: 'Fjöldi starfsmanna að meðaltali',
    description: 'Count input label',
  },
  calculate: {
    id: 'web.VerAnnouncementCalculator:calculate',
    defaultMessage: 'Reikna',
    description: 'Calculate button text',
  },
  results: {
    id: 'web.VerAnnouncementCalculator:results',
    defaultMessage: 'Niðurstaða',
    description: 'Results section heading',
  },
  daysWithoutWeekends: {
    id: 'web.VerAnnouncementCalculator:daysWithoutWeekends',
    defaultMessage: 'Virkir dagar',
    description: 'Label for days without weekends in results',
  },
  needsAnnouncement: {
    id: 'web.VerAnnouncementCalculator:needsAnnouncement',
    defaultMessage: 'Tilkynningaskylt',
    description: 'Label for needs announcement in results',
  },
  noAnnouncement: {
    id: 'web.VerAnnouncementCalculator:noAnnouncement',
    defaultMessage: 'Ekki tilkynningaskylt',
    description: 'Label for no announcement in results',
  },
  amountOfDaysWork: {
    id: 'web.VerAnnouncementCalculator:amountOfDaysWork',
    defaultMessage: 'Fjöldi dagsverka',
    description: 'Label for amount of days work in results',
  },
})
