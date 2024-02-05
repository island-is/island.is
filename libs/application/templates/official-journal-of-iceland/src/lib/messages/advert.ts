import { defineMessages } from 'react-intl'

export const advert = {
  general: defineMessages({
    formTitle: {
      id: 'ojoi.application:advert.general.formTitle',
      defaultMessage: 'Nýtt mál',
      description: 'Title of the new case form',
    },
    formIntro: {
      id: 'ojoi.application:advert.general.formIntro',
      defaultMessage:
        'Veldu deild og tegund birtingar í fellilistanum hér að neðan og skráðu heiti auglýsingar í viðeigandi reit. Tegundarheitið birtist sjálfkrafa í hástöfum í fyrirsögn og titillinn í næstu línu. Efni auglýsinga er sett í ritilinn hér að neðan og skal vanda alla uppsetningu, setja inn töluliði, töflur o.þ.h. Til einföldunar við vinnslu meginmáls getur þú valið sniðmát og aðlagað það að þinni auglýsingu eða sótt eldri auglýsingu og breytt henni.',
      description: 'Description of the new case form',
    },
    sectionTitle: {
      id: 'ojoi.application:advert.general.sectionTitle',
      defaultMessage: 'Grunnupplýsingar',
      description: 'Title of the new case section',
    },
    additonalSignature: {
      id: 'ojoi.application:advert.general.additonalSignature',
      defaultMessage: 'Aukaundirritun',
      description: 'Title of the additional signature',
    },
    committeeMembers: {
      id: 'ojoi.application:advert.general.committeeMembers',
      defaultMessage: 'Einstaklingar nefndar',
      description: 'Title of the committee members',
    },
    preview: {
      id: 'ojoi.application:advert.general.preview',
      defaultMessage: 'Sýnishorn',
      description: 'Title of the preview',
    },
    signedBy: {
      id: 'ojoi.application:advert.general.signedBy',
      defaultMessage: 'Undirritað af',
      description: 'Title of the signed by',
    },
    chairman: {
      id: 'ojoi.application:advert.general.chairman',
      defaultMessage: 'Formaður',
      description: 'Title of the chairman',
    },
  }),
  tabs: {
    regular: defineMessages({
      label: {
        id: 'ojoi.application:advert.tabs.regular.label',
        defaultMessage: 'Hefðbundin undirritun',
        description: 'Label for the regular signature tab',
      },
    }),
    committee: defineMessages({
      label: {
        id: 'ojoi.application:advert.tabs.committee.label',
        defaultMessage: 'Undirritun nefndar',
        description: 'Label for the committee signature tab',
      },
    }),
  },
  modal: defineMessages({
    title: {
      id: 'ojoi.application:advert.modal.title',
      defaultMessage: 'Mál til afritunar',
      description: 'Title of the copy old case modal',
    },
    searchPlaceholder: {
      id: 'ojoi.application:advert.modal.searchPlaceholder',
      defaultMessage: 'Sláðu inn leitarorð',
      description: 'Placeholder for the search input',
    },
  }),
  materialForPublicationChapter: defineMessages({
    title: {
      id: 'ojoi.application:advert.materialForPublicationChapter.title',
      defaultMessage: 'Efni til birtingar',
      description: 'Title of the material for publication chapter',
    },
  }),
  signatureChapter: defineMessages({
    title: {
      id: 'ojoi.application:advert.signatureChapter.title',
      defaultMessage: 'Texti undirritunarkafla',
      description: 'Title of the signature chapter',
    },
    intro: {
      id: 'ojoi.application:advert.signatureChapter.intro',
      defaultMessage:
        'Hér má velja þá uppsetningu undirrritana sem best á við. Mikilvægt er að tryggja samræmi við frumtexta, til dæmis varðandi stað og dagsetningu.',
      description: 'Intro of the signature chapter',
    },
  }),
  buttons: {
    copyOldCase: defineMessages({
      label: {
        id: 'ojoi.application:advert.buttons.copyOldCase.label',
        defaultMessage: 'Afrita eldra mál',
        description: 'Label for the copy old case button',
      },
    }),
    copyLastSignature: defineMessages({
      label: {
        id: 'ojoi.application:advert.buttons.copyLastSignature.label',
        defaultMessage: 'Afrita síðustu undirskrift',
        description: 'Label for the copy last signature button',
      },
    }),
    addCommitteeMember: defineMessages({
      label: {
        id: 'ojoi.application:advert.buttons.addCommitteeMember.label',
        defaultMessage: 'Bæta við nefndarmanni',
        description: 'Label for the add committee member button',
      },
    }),
    addPerson: defineMessages({
      label: {
        id: 'ojoi.application:advert.buttons.addPerson.label',
        defaultMessage: 'Bæta við persónu',
        description: 'Label for the add person button',
      },
    }),
    addInstitution: defineMessages({
      label: {
        id: 'ojoi.application:advert.buttons.addInstitution.label',
        defaultMessage: 'Bæta við stað/stofnun',
        description: 'Label for the add institution button',
      },
    }),
  },
  inputs: {
    department: defineMessages({
      label: {
        id: 'ojoi.application:advert.inputs.departmentInput.label',
        defaultMessage: 'Deild',
        description: 'Label for the department input',
      },
      placeholder: {
        id: 'ojoi.application:advert.inputs.departmentInput.placeholder',
        defaultMessage: 'Veldu deild',
        description: 'Placeholder for the department input',
      },
    }),
    type: defineMessages({
      label: {
        id: 'ojoi.application:advert.inputs.type.label',
        defaultMessage: 'Tegund birtingar',
        description: 'Label for the publishing type input',
      },
      placeholder: {
        id: 'ojoi.application:advert.inputs.type.placeholder',
        defaultMessage: 'Veldu tegund birtingar',
        description: 'Placeholder for the publishing type input',
      },
    }),
    subType: defineMessages({
      label: {
        id: 'ojoi.application:advert.inputs.subType.label',
        defaultMessage: 'Undirtegund',
        description: 'Label for the sub type input',
      },
      placeholder: {
        id: 'ojoi.application:advert.inputs.subType.placeholder',
        defaultMessage: 'Veldu undirtegund',
        description: 'Placeholder for the sub type input',
      },
    }),
    title: defineMessages({
      label: {
        id: 'ojoi.application:advert.inputs.title.label',
        defaultMessage: 'Heiti auglýsingar',
        description: 'Label for the title of case input',
      },
      placeholder: {
        id: 'ojoi.application:advert.inputs.title.placeholder',
        defaultMessage: 'Heiti auglýsingar',
        description: 'Placeholder for the name of case input',
      },
    }),
    template: defineMessages({
      label: {
        id: 'ojoi.application:advert.inputs.templateInput.label',
        defaultMessage: 'Sniðmát',
        description: 'Label for the template input',
      },
      placeholder: {
        id: 'ojoi.application:advert.inputs.templateInput.placeholder',
        defaultMessage: 'Fyrirmyndir auglýsinga',
        description: 'Placeholder for the template input',
      },
    }),
    signatureType: defineMessages({
      label: {
        id: 'ojoi.application:advert.inputs.signatureTypeInput.label',
        defaultMessage: 'Tegund undirskriftar',
        description: 'Label for the signature type input',
      },
      placeholder: {
        id: 'ojoi.application:advert.inputs.signatureTypeInput.placeholder',
        defaultMessage: 'Dæmigerðar undirritanir',
        description: 'Placeholder for the signature type input',
      },
    }),
    signature: {
      institution: defineMessages({
        label: {
          id: 'ojoi.application:advert.inputs.signatureInstitutionInput.label',
          defaultMessage: 'Staður/stofnun',
          description: 'Label for the signature place / institution input',
        },
        placeholder: {
          id: 'ojoi.application:advert.inputs.signatureInstitutionInput.placeholder',
          defaultMessage: 'Reykjavík',
          description: 'Placeholder for the signature place input',
        },
      }),
      date: defineMessages({
        label: {
          id: 'ojoi.application:advert.inputs.signatureDateInput.label',
          defaultMessage: 'Dagsetning',
          description: 'Label for the signature date input',
        },
        placeholder: {
          id: 'ojoi.application:advert.inputs.signatureDateInput.placeholder',
          defaultMessage: '01.02.2024',
          description: 'Placeholder for the signature date input',
        },
      }),
      textAbove: defineMessages({
        label: {
          id: 'ojoi.application:advert.inputs.signatureTextAboveInput.label',
          defaultMessage: 'Texti yfir',
          description: 'Label for the signature text above input',
        },
      }),
      textAfter: defineMessages({
        label: {
          id: 'ojoi.application:advert.inputs.signatureTextAfterInput.label',
          defaultMessage: 'Texti eftir',
          description: 'Label for the signature text after input',
        },
      }),
      textBelow: defineMessages({
        label: {
          id: 'ojoi.application:advert.inputs.signatureTextBelowInput.label',
          defaultMessage: 'Texti undir',
          description: 'Label for the signature text below input',
        },
      }),
      name: defineMessages({
        label: {
          id: 'ojoi.application:advert.inputs.signatureNameInput.label',
          defaultMessage: 'Nafn',
          description: 'Label for the signature name input',
        },
        placeholder: {
          id: 'ojoi.application:advert.inputs.signatureNameInput.placeholder',
          defaultMessage: 'Undirritari',
          description: 'Placeholder for the signature name input',
        },
      }),
    },
  },
}
