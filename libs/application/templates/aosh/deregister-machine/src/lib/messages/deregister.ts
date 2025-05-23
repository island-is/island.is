import { defineMessages } from 'react-intl'

export const deregister = {
  general: defineMessages({
    title: {
      id: 'aosh.drm.application:deregister.general.title',
      defaultMessage: 'Afskráning',
      description: 'Title of deregistration screen',
    },
    description: {
      id: 'aosh.drm.application:deregister.general.description',
      defaultMessage:
        'Verði vélin tekin í notkun aftur ber eiganda að óska eftir skoðun hjá Vinnueftirliti ríkisins.',
      description: 'Description of deregister screen',
    },
  }),
  labels: defineMessages({
    fateOfMachine: {
      id: 'aosh.drm.application:deregister.labels.fateOfMachine',
      defaultMessage: 'Afdrif tækis',
      description: 'Location more info label',
    },
    approveButton: {
      id: 'aosh.drm.application:deregister.labels.approveButton',
      defaultMessage: 'Áfram',
      description: 'Location approve button text',
    },
    temporary: {
      id: 'aosh.drm.application:deregister.labels.temporary',
      defaultMessage: 'Timabundin afskráning',
      description: 'Temporary label',
    },
    temporaryDescription: {
      id: 'aosh.drm.application:deregister.labels.temporaryDescription',
      defaultMessage:
        'Tímabundin afskráning getur verið ef vél:<br>' +
        '• seld úr landi<br>' +
        '• fargað eða seld í brotajárn<br>' +
        '• nýtt í varahluti',
      description: 'Temporary description label',
    },
    permanent: {
      id: 'aosh.drm.application:deregister.labels.permanent',
      defaultMessage: 'Endanleg afskráning',
      description: 'permanent label',
    },
    permanentDescription: {
      id: 'aosh.drm.application:deregister.labels.permanentDescription',
      defaultMessage:
        'Endanleg afskráning getur verið ef vél er:<br>' +
        '• seld úr landi <br>' +
        '• fargað eða seld í brotajárn<br>' +
        '• nýtt í varahluti<br>' +
        'Vélar sem eru afskráðar endanlega má endurskrá. Þær þarf að skoða af eftirlitsmanni áður en hægt er að endurskrá.',
      description: 'Permanent description label',
    },
    date: {
      id: 'aosh.drm.application:deregister.general.date',
      defaultMessage: 'Dagsetning',
      description: 'Date label',
    },
  }),
}
