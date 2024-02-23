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
    addressTitle: {
      id: 'aosh.drm.application:deregister.labels.addressTitle',
      defaultMessage: 'Staðsetning',
      description: 'Location select title',
    },
    ownerIsderegister: {
      id: 'aosh.drm.application:deregister.labels.addressLabel',
      defaultMessage: 'Eigandi er umráðamaður',
      description: 'Location address label',
    },
    postCodeLabel: {
      id: 'aosh.drm.application:deregister.labels.postCodeLabel',
      defaultMessage: 'Póstnúmer',
      description: 'Cocation postcode label',
    },
    moreInfoLabel: {
      id: 'aosh.drm.application:deregister.labels.moreInfoLabel',
      defaultMessage: 'Nánari lýsing',
      description: 'Location more info label',
    },
    approveButton: {
      id: 'aosh.drm.application:deregister.labels.approveButton',
      defaultMessage: 'Staðfesta',
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
        'Tímabundin afskráning getur verið ef vél:<br>• seld úr landi<br>• fargað eða seld í brotajárn<br>• nýtt í varahluti',
      description: 'Temporary description label',
    },
    final: {
      id: 'aosh.drm.application:deregister.labels.final',
      defaultMessage: 'Endanleg afskráning',
      description: 'Final label',
    },
    finalDescription: {
      id: 'aosh.drm.application:deregister.labels.finalDescription',
      defaultMessage:
        'Endanleg afskráning getur verið ef vél er:<br>• seld úr landi<br>• fargað eða seld í brotajárn<br>• nýtt í varahluti<br>Vélar sem eru afskráðar endanlega má endurskrá. Þær þarf að skoða af eftirlitsmanni áður en hægt er að endurskrá.',
      description: 'Final description label',
    },
    date: {
      id: 'aosh.drm.application:deregister.general.date',
      defaultMessage: 'Dagsetning',
      description: 'Date label',
    },
  }),
}
