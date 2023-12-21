import { defineMessages } from 'react-intl'

export const publishingPrefrences = {
  general: defineMessages({
    formTitle: {
      id: 'ojoi.application:publishingPrefrences.general.formTitle',
      defaultMessage: 'Óskir um birtingu',
      description: 'Title of the publishing prefrences form',
    },
    formIntro: {
      id: 'ojoi.application:publishingPrefrences.general.formIntro',
      defaultMessage:
        'Mál sem sent er til birtingar birtist 10 virkum dögum eftir skrásetningardag, hægt er að biðja um að mál birtist fyrr gegn greiðslu álags. Til að fá mál birt samdægurs þarf mál að hafa borist Stjórnartíðindum fyrir hádegi þann dag. Senda skal skilaboð með máli um birtingu samdægurs.',
      description: 'Intro of the publishing prefrences form',
    },
    sectionTitle: {
      id: 'ojoi.application:publishingPrefrences.general.sectionTitle',
      defaultMessage: 'Óskir um birtingu',
      description: 'Title of the publishing prefrences section',
    },
    communicationChannel: {
      id: 'ojoi.application:publishingPrefrences.general.communicationChannel',
      defaultMessage: 'Samskiptaleið',
      description: 'Title of the communication channel',
    },
  }),
  dateChapter: defineMessages({
    title: {
      id: 'ojoi.application:publishingPrefrences.dateChapter.title',
      defaultMessage: 'Hvenær viltu að auglýsing birtist?',
      description: 'Title of the date chapter',
    },
  }),
  communicationChapter: defineMessages({
    title: {
      id: 'ojoi.application:publishingPrefrences.communicationChapter.title',
      defaultMessage: 'Samskiptaleiðir',
      description: 'Title of the communication chapter',
    },
    intro: {
      id: 'ojoi.application:publishingPrefrences.communicationChapter.intro',
      defaultMessage:
        'Hér birtast þeir málaflokkar sem auglýsigin verður sett undir við birtingu á stjornartidindi.is - Sendandi getur sjálfur valið málaflokka fyrir sínar auglýsingar sem hafa áhrif á málaflokkun á yfirlitssíðunni  Mínar birtingar.',
      description: 'Intro of the communication chapter',
    },
  }),
  messagesChapter: defineMessages({
    title: {
      id: 'ojoi.application:publishingPrefrences.messagesChapter.title',
      defaultMessage: 'Skilaboð',
      description: 'Title of the messages chapter',
    },
    intro: {
      id: 'ojoi.application:publishingPrefrences.messagesChapter.intro',
      defaultMessage: 'Lorem ipsum eitthvað hér?',
      description: 'Intro of the messages chapter',
    },
  }),
  inputs: {
    datepicker: defineMessages({
      label: {
        id: 'ojoi.application:publishingPrefrences.inputs.datepicker.label',
        defaultMessage: 'Dagsetning',
        description: 'Label of the datepicker input',
      },
    }),
    fastTrack: defineMessages({
      label: {
        id: 'ojoi.application:publishingPrefrences.inputs.fastTrack.label',
        defaultMessage: 'Samdægursbirting',
        description: 'Label of the fast track checkbox input',
      },
    }),
    messages: defineMessages({
      label: {
        id: 'ojoi.application:publishingPrefrences.inputs.messages.label',
        defaultMessage: 'Skilaboð',
        description: 'Label of the messages textarea input',
      },
      placeholder: {
        id: 'ojoi.application:publishingPrefrences.inputs.messages.placeholder',
        defaultMessage:
          'Hér er hægt að skrifa skilaboð til Stjórnartíðinda varðandi auglýsinguna.',
        description: 'Placeholder of the messages textarea input',
      },
    }),
  },
  buttons: {
    addCommunicationChannel: defineMessages({
      label: {
        id: 'ojoi.application:publishingPrefrences.buttons.addCommunicationChannel.label',
        defaultMessage: 'Bæta við samskiptaleið',
        description: 'Label of the add communication channel button',
      },
    }),
  },
}
