import { defineMessages } from 'react-intl'

export const advert = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:advert.general.title',
      defaultMessage: 'Nýtt mál',
      description: 'Title of the advert form',
    },
    intro: {
      id: 'ojoi.application:advert.general.intro',
      defaultMessage:
        'Veldu deild og tegund birtingar í fellilistanum hér að neðan og skráðu heiti innsendingar í viðeigandi reit. Tegundarheitið birtist sjálfkrafa í hástöfum í fyrirsögn og titillinn í næstu línu. Efni innsendingar er sett í ritilinn hér að neðan og skal vanda alla uppsetningu, setja inn töluliði, töflur o.þ.h. Til einföldunar við vinnslu meginmáls getur þú valið sniðmát og aðlagað það að þinni innsendingu eða sótt eldri innsendingar og breytt henni.',
      description: 'Intro of the advert form',
    },
    section: {
      id: 'ojoi.application:advert.general.section',
      defaultMessage: 'Grunnupplýsingar',
      description: 'Title of the advert section',
    },
  }),
  headings: defineMessages({
    materialForPublication: {
      id: 'ojoi.application:advert.headings.materialForPublication',
      defaultMessage: 'Efni til birtingar',
      description: 'Material for publication section heading',
    },
  }),
  buttons: defineMessages({
    copyOldAdvert: {
      id: 'ojoi.application:advert.buttons.copyOldAdvert.label',
      defaultMessage: 'Afrita eldri mál',
      description: 'Label for the copy old advert button',
    },
  }),
  modal: defineMessages({
    title: {
      id: 'ojoi.application:advert.modal.title',
      defaultMessage: 'Mál til afritunar',
      description: 'Title of the advert modal',
    },
    search: {
      id: 'ojoi.application:advert.modal.search',
      defaultMessage: 'Sláðu inn leitarorð',
      description: 'Search button in the advert modal',
    },
  }),
  inputs: {
    department: defineMessages({
      label: {
        id: 'ojoi.application:advert.inputs.department.label',
        defaultMessage: 'Deild',
        description: 'Label for the department input',
      },
      placeholder: {
        id: 'ojoi.application:advert.inputs.department.placeholder',
        defaultMessage: 'Veldu deild',
        description: 'Placeholder for the department input',
      },
    }),
    type: defineMessages({
      label: {
        id: 'ojoi.application:advert.inputs.type.label',
        defaultMessage: 'Tegund birtingar',
        description: 'Label for the type input',
      },
      placeholder: {
        id: 'ojoi.application:advert.inputs.type.placeholder',
        defaultMessage: 'Veldu tegund birtingar',
        description: 'Placeholder for the type input',
      },
    }),
    title: defineMessages({
      label: {
        id: 'ojoi.application:advert.inputs.title.label',
        defaultMessage: 'Titill innsendingar',
        description: 'Label for the title input',
      },
      placeholder: {
        id: 'ojoi.application:advert.inputs.title.placeholder',
        defaultMessage: 'Skráðu heiti innsendingar',
        description: 'Placeholder for the title input',
      },
    }),
    template: defineMessages({
      label: {
        id: 'ojoi.application:advert.inputs.template.label',
        defaultMessage: 'Sniðmát efnis',
        description: 'Label for the template input',
      },
      placeholder: {
        id: 'ojoi.application:advert.inputs.template.placeholder',
        defaultMessage: 'Fyrirmynd innsendingar',
        description: 'Placeholder for the template input',
      },
    }),
    editor: defineMessages({
      label: {
        id: 'ojoi.application:advert.inputs.editor.label',
        defaultMessage: 'Innihald innsendingar',
        description: 'Label for the editor input',
      },
    }),
  },
}
