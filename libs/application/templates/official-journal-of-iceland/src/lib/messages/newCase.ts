import { defineMessages } from 'react-intl'

export const newCase = {
  general: defineMessages({
    formTitle: {
      id: 'ojoi.application:newCase.general.formTitle',
      defaultMessage: 'Nýtt mál',
      description: 'Title of the new case form',
    },
    formIntro: {
      id: 'ojoi.application:newCase.general.formIntro',
      defaultMessage:
        'Veldu deild og tegund birtingar í fellilistanum hér að neðan og skráðu heiti auglýsingar í viðeigandi reit. Tegundarheitið birtist sjálfkrafa í hástöfum í fyrirsögn og titillinn í næstu línu. Efni auglýsinga er sett í ritilinn hér að neðan og skal vanda alla uppsetningu, setja inn töluliði, töflur o.þ.h. Til einföldunar við vinnslu meginmáls getur þú valið sniðmát og aðlagað það að þinni auglýsingu eða sótt eldri auglýsingu og breytt henni.',
      description: 'Description of the new case form',
    },
    sectionTitle: {
      id: 'ojoi.application:newCase.general.sectionTitle',
      defaultMessage: 'Grunnupplýsingar',
      description: 'Title of the new case section',
    },
  }),
  modal: defineMessages({
    title: {
      id: 'ojoi.application:newCase.modal.title',
      defaultMessage: 'Mál til afritunar',
      description: 'Title of the copy old case modal',
    },
    searchPlaceholder: {
      id: 'ojoi.application:newCase.modal.searchPlaceholder',
      defaultMessage: 'Sláðu inn leitarorð',
      description: 'Placeholder for the search input',
    },
  }),
  materialForPublicationChapter: defineMessages({
    title: {
      id: 'ojoi.application:newCase.materialForPublicationChapter.title',
      defaultMessage: 'Efni til birtingar',
      description: 'Title of the material for publication chapter',
    },
  }),
  signatureChapter: defineMessages({
    title: {
      id: 'ojoi.application:newCase.signatureChapter.title',
      defaultMessage: 'Texti undirritunarkafla',
      description: 'Title of the signature chapter',
    },
    intro: {
      id: 'ojoi.application:newCase.signatureChapter.intro',
      defaultMessage: 'Undirritaðu með því að skrifa nafn þitt hér að neðan',
      description:
        'Hér má velja þá uppsetningu undirrritana sem best á við. Mikilvægt er að tryggja samræmi við frumtexta, til dæmis varðandi stað og dagsetningu.',
    },
  }),
  buttons: {
    copyOldCase: defineMessages({
      label: {
        id: 'ojoi.application:newCase.buttons.copyOldCase.label',
        defaultMessage: 'Afrita eldri mál',
        description: 'Label for the copy old case button',
      },
    }),
    copyLastSignature: defineMessages({
      label: {
        id: 'ojoi.application:newCase.buttons.copyLastSignature.label',
        defaultMessage: 'Afrita síðustu undirskrift',
        description: 'Label for the copy last signature button',
      },
    }),
  },
  inputs: {
    department: defineMessages({
      label: {
        id: 'ojoi.application:newCase.inputs.departmentInput.label',
        defaultMessage: 'Deild',
        description: 'Label for the department input',
      },
      placeholder: {
        id: 'ojoi.application:newCase.inputs.departmentInput.placeholder',
        defaultMessage: 'Veldu deild',
        description: 'Placeholder for the department input',
      },
    }),
    publishingType: defineMessages({
      label: {
        id: 'ojoi.application:newCase.inputs.publishingTypeInput.label',
        defaultMessage: 'Tegund birtingar',
        description: 'Label for the publishing type input',
      },
      placeholder: {
        id: 'ojoi.application:newCase.inputs.publishingTypeInput.placeholder',
        defaultMessage: 'Veldu tegund birtingar',
        description: 'Placeholder for the publishing type input',
      },
    }),
    nameOfCase: defineMessages({
      label: {
        id: 'ojoi.application:newCase.inputs.nameOfCaseInput.label',
        defaultMessage: 'Heiti auglýsingar',
        description: 'Label for the name of case input',
      },
      placeholder: {
        id: 'ojoi.application:newCase.inputs.nameOfCaseInput.placeholder',
        defaultMessage: 'Heiti auglýsingar',
        description: 'Placeholder for the name of case input',
      },
    }),
    template: defineMessages({
      label: {
        id: 'ojoi.application:newCase.inputs.templateInput.label',
        defaultMessage: 'Sniðmát',
        description: 'Label for the template input',
      },
      placeholder: {
        id: 'ojoi.application:newCase.inputs.templateInput.placeholder',
        defaultMessage: 'Fyrirmyndir auglýsinga',
        description: 'Placeholder for the template input',
      },
    }),
    signatureType: defineMessages({
      label: {
        id: 'ojoi.application:newCase.inputs.signatureTypeInput.label',
        defaultMessage: 'Tegund undirskriftar',
        description: 'Label for the signature type input',
      },
      placeholder: {
        id: 'ojoi.application:newCase.inputs.signatureTypeInput.placeholder',
        defaultMessage: 'Dæmigerðar undirritanir',
        description: 'Placeholder for the signature type input',
      },
    }),
  },
}
