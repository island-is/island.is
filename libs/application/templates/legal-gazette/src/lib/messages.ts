import { defineMessages } from 'react-intl'

export const m = {
  general: defineMessages({
    institution: {
      id: 'lg.application:general.institution',
      defaultMessage: 'Dómsmálaráðuneytið',
      description: `Stofnun umsóknar`,
    },
    application: {
      id: 'lg.application:general.application',
      defaultMessage: 'Lögbirtingarblaðið',
      description: `Heiti umsóknar`,
    },
  }),
  errors: defineMessages({
    emptyString: {
      id: 'lg.application:errors.emptyString',
      defaultMessage: 'Yfirskrift má ekki vera tóm',
      description: 'Villa sem kemur upp ef gildið er tómt',
    },
    emptyHtml: {
      id: 'lg.application:errors.emptyHtml',
      defaultMessage: 'Meginmál má ekki vera autt',
      description: 'Villa sem kemur upp ef HTML texti er tómur',
    },
    emptyChannel: {
      id: 'lg.application:errors.emptyChannel',
      defaultMessage:
        'Að minnsta kosti ein samskiptaleið þarf að vera til staðar',
      description: 'Villa sem kemur upp ef samskiptaleið er tóm',
    },
    emptyType: {
      id: 'lg.application:errors.emptyType',
      defaultMessage: 'Tegund auglýsingar má ekki vera auð',
      description: 'Villa sem kemur upp ef tegund auglýsingar er tóm',
    },
    emptyCategory: {
      id: 'lg.application:errors.emptyCategory',
      defaultMessage: 'Flokkur auglýsingar má ekki vera auð',
      description: 'Villa sem kemur upp ef flokkur auglýsingar er tóm',
    },
    emptyEmail: {
      id: 'lg.application:errors.emptyEmail',
      defaultMessage: 'Netfang má ekki vera autt',
      description: 'Villa sem kemur upp ef netfang er tóm',
    },
    emptyLocation: {
      id: 'lg.application:errors.emptyLocation',
      defaultMessage: 'Undirskriftarstaður má ekki vera auður',
      description: 'Villa sem kemur upp ef undirskriftarstaður er tómur',
    },
    emptySignature: {
      id: 'lg.application:errors.emptySignature',
      defaultMessage:
        'Fylla þarf út nafn, staðsetning eða dagsetningu undirritunar',
      description: 'Villa sem kemur upp ef undirskrift er tóm',
    },
    emptySignatureDate: {
      id: 'lg.application:errors.emptySignatureDate',
      defaultMessage: 'Dagsetning undirskriftar má ekki vera auð',
      description: 'Villa sem kemur upp ef dagsetning undirskriftar er tóm',
    },
    emptySignatureName: {
      id: 'lg.application:errors.emptySignatureName',
      defaultMessage: 'Undirskrift má ekki vera auð',
      description: 'Villa sem kemur upp ef undirskrift er tóm',
    },
    emptyPublishingDates: {
      id: 'lg.application:errors.emptyPublishingDates',
      defaultMessage:
        'Að minnsta kosti einn birtingardagur þarf að vera til staðar',
      description: 'Villa sem kemur upp ef birtingardagsetning er tóm',
    },
    invalidEmail: {
      id: 'lg.application:errors.invalidEmail',
      defaultMessage: 'Netfang er ekki gilt',
      description: 'Villa sem kemur upp ef netfang er ekki í réttu sniði',
    },
    failedToSubmitTitle: {
      id: 'lg.application:errors.failedToSubmitTitle',
      defaultMessage: 'Ekki tókst að senda inn umsókn',
      description: 'Villa sem kemur upp ef umsóknin tekst ekki að senda inn',
    },
    failedToSubmitMessage: {
      id: 'lg.application:errors.failedToSubmitMessage',
      defaultMessage:
        'Ekki tókst að ná sambandi við vefþjóna Lögbirtingarblaðsins. Vinsamlegast reyndu aftur síðar.',
      description: 'Villa sem kemur upp ef umsóknin tekst ekki að senda inn',
    },
    internalError: {
      id: 'lg.application:errors.internalError',
      defaultMessage: 'Innri kerfisvilla kom upp',
      description: 'Villa sem kemur upp ef innri villa kemur upp',
    },
    createApplicationError: {
      id: 'lg.application:errors.createApplicationError',
      defaultMessage: 'Ekki tókst að búa til umsókn',
      description: 'Villa sem kemur upp ef ekki tókst að búa til umsókn',
    },
  }),
  dataproviders: {
    provider: defineMessages({
      sectionTitle: {
        id: 'lg.application:dataproviders.provider.sectionTitle',
        defaultMessage: 'Gagnaöflun',
        description: 'Heiti kafla fyrir veitu',
      },
      title: {
        id: 'lg.application:dataproviders.provider.title',
        defaultMessage: 'Almenn umsókn Lögbirtingablaðsins',
        description: 'Heiti á veitu',
      },
    }),
    nationalRegistry: defineMessages({
      title: {
        id: 'lg.application:nationalRegistry.title',
        defaultMessage: 'Upplýsingar úr Þjóðskrá',
        description: 'Heiti á þjóðskrá',
      },
      description: {
        id: 'lg.application:nationalRegistry.description',
        defaultMessage: 'Sækir upplýsingar um þig úr þjóðskrá',
        description: 'Lýsing á þjóðskrá',
      },
    }),
    userProfile: defineMessages({
      title: {
        id: 'lg.application:userProfile.description',
        defaultMessage: 'Mínar síður á Ísland.is/stillingar',
        description: 'Lýsing á notendaprófílnum',
      },
      description: {
        id: 'lg.application:userProfile.description',
        defaultMessage:
          'Ef þú ert með skráaðar upplýsingar um síma og netfang á Mínum Síðum inná Ísland.is kemur það sjálfkrafa í umsókn þína.',
        description: 'Lýsing á notendaprófílnum',
      },
    }),
  },
  requirements: {
    approval: defineMessages({
      sectionTitle: {
        id: 'lg.application:requirements.section.title',
        defaultMessage: 'Upplýsingar',
        description: 'Heiti kafla Upplýsingar um innsendingar',
      },
      formTitle: {
        id: 'lg.application:requirements.form.title',
        defaultMessage: 'Upplýsingar um innsendingar',
        description: 'Titill á skjá Upplýsingum um innsendingar',
      },
      introPartOne: {
        id: 'lg.application:requirements.intro.part.one',
        defaultMessage: `Þú ert að fara að senda mál til birtingar í Lögbirtingu.`,
        description: 'Inngangur á skjá Upplýsingar um innsendingar',
      },
      introPartTwo: {
        id: 'lg.application:requirements.intro.part.two',
        defaultMessage: `Um útgáfu Lögbirtingablaðs gilda lög um Stjórnartíðindi og Lögbirtingablað nr. 15/2005.`,
        description: 'Inngangur á skjá Upplýsingar um innsendingar',
      },
      introPartThree: {
        id: 'lg.application:requirements.intro.part.three',
        defaultMessage: `Í Lögbirtingablaði skal birta dómsmálaauglýsingar, svo sem stefnur til dóms, úrskurði um töku búa til opinberra skipta og áskoranir um kröfulýsingar, auglýsingar um skiptafundi og skiptalok þrotabúa, nauðungarsölur, þar á meðal á fasteignum búa sem eru til opinberra skipta, auglýsingar um vogrek, óskilafé og fundið fé, auglýsingar um kaupmála hjóna, lögræðissviptingu og brottfall hennar, lögboðnar auglýsingar um félög og firmu, sérleyfi er stjórnvöld veita, opinber verðlagsákvæði og annað það er stjórnvöldum þykir rétt að birta almenningi.`,
        description: 'Inngangur á skjá Upplýsingar um innsendingar',
      },
      introPartFour: {
        id: 'lg.application:requirements.intro.part.four',
        defaultMessage: `Reikninga vegna birtinga í Lögbirtingablaði er hægt að nálgast á island.is en einnig eru sendar kröfur á netbanka auglýsanda.Greiðsla þarf að hafa borist áður en hægt er að birta auglýsingu.`,
        description: 'Inngangur á skjá Upplýsingar um innsendingar',
      },
      introPartFive: {
        id: 'lg.application:requirements.intro.part.five',
        defaultMessage: `Athugið að afgreiðslutími auglýsinga er amk 4 virkir dagar`,
        description: 'Inngangur á skjá Upplýsingar um innsendingar',
      },
      checkboxLabel: {
        id: 'lg.application:requirements.checkbox.label',
        defaultMessage:
          'Ég skil ofangreindar upplýsingar og hef leyfi til þess að senda inn mál til birtingar',
        description: 'Texti á checkboxi á skjá Upplýsingar um innsendingar',
      },
      checkboxError: {
        id: 'lg.application:requirements.checkbox.error',
        defaultMessage: 'Samþykkja þarf gagnaöflun til að halda áfram',
        description: 'Villa sem kemur upp ef notandi samþykkir ekki skilyrði',
      },
    }),
    legalEntity: defineMessages({
      sectionTitle: {
        id: 'lg.application:requirements.legalEntity.section.title',
        defaultMessage: 'Lögaðilar',
        description: 'Heiti kafla Lögaðilar',
      },
      selectPlaceholder: {
        id: 'lg.application:requirements.legalEntity.select.placeholder',
        defaultMessage: 'Veldu lögaðila',
        description: 'Placeholder á dropdown á skjá Stofnun',
      },
      formTitle: {
        id: 'lg.application:requirements.legalEntity.form.title',
        defaultMessage: 'Veldu lögaðila',
        description: 'Titill á skjá Stofnun',
      },
      formIntro: {
        id: 'lg.application:requirements.legalEntity.form.intro',
        defaultMessage:
          'Þú hefur aðgang að fleiri en einum lögaðila, veldu þann sem þú vilt senda auglýsingu fyrir.',
        description: 'Inngangur á skjá Stofnun',
      },
      selectTitle: {
        id: 'lg.application:requirements.legalEntity.select.title',
        defaultMessage: 'Veldu lögaðila',
        description: 'Titill á dropdown á skjá Stofnun',
      },
      selectError: {
        id: 'lg.application:requirements.legalEntity.select.error',
        defaultMessage: 'Þú verður að velja lögaðila til að halda áfram',
        description: 'Villa sem kemur upp ef notandi velur ekki lögaðila',
      },
    }),
    advertType: defineMessages({
      sectionTitle: {
        id: 'lg.application:requirements.advertType.section.title',
        defaultMessage: 'Tegund auglýsingar',
        description: 'Heiti kafla Auglýsingar',
      },
      formTitle: {
        id: 'lg.application:requirements.advertType.form.title',
        defaultMessage: 'Ný auglýsing',
        description: 'Titill á skjá Auglýsingar',
      },
      formIntro: {
        id: 'lg.application:requirements.advertType.form.intro',
        defaultMessage:
          'Veldu tegund auglýsingar sem þú vilt skrá. Fyrir sumar tegundir eru í boði innsláttarform til að auðvelda skráningu. Þú getur einnig sótt texta áður skráðrar auglýsingar af sömu tegund og notað sem grunn að nýrri.',
        description: 'Inngangur á skjá Auglýsingar',
      },
      selectTitle: {
        id: 'lg.application:requirements.advertType.select.title',
        defaultMessage: 'Tegund',
        description: 'Titill á dropdown á skjá Auglýsingar',
      },
      selectPlaceholder: {
        id: 'lg.application:requirements.advertType.select.placeholder',
        defaultMessage: 'Veldu tegund',
        description: 'Placeholder á dropdown á skjá Auglýsingar',
      },
      selectError: {
        id: 'lg.application:requirements.advertType.select.error',
        defaultMessage:
          'Þú verður að velja tegund auglýsingar til að halda áfram',
        description: 'Villa sem kemur upp ef notandi velur ekki tegund',
      },
      recentlySelected: {
        id: 'lg.application:requirements.advertType.recentlySelected',
        defaultMessage: 'Síðast valið',
        description: 'Titill á síðast valinni tegund á skjá Auglýsingar',
      },
    }),
  },
  draft: {
    sections: {
      advert: defineMessages({
        sectionTitle: {
          id: 'lg.application:draft.advert.sectionTitle',
          defaultMessage: 'Auglýsing',
          description: 'Heiti kafla fyrir auglýsingu',
        },
        formTitle: {
          id: 'lg.application:draft.advert.formTitle',
          defaultMessage: 'Almenn auglýsing',
          description: 'Titill á formi fyrir auglýsingu',
        },
        formIntro: {
          id: 'lg.application:draft.advert.formIntro',
          defaultMessage:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet mattis erat, eget dignissim lacus. Cras id enim ac urna bibendum gravida. Donec ultricies dapibus lacinia. Curabitur ut est urna. Donec id eleifend erat. Nam et posuere arcu.',
          description: 'Inngangur á formi fyrir auglýsingu',
        },
        captionInput: {
          id: 'lg.application:draft.advert.captionInput',
          defaultMessage: 'Yfirskrift',
          description: 'Yfirskrift auglýsingar',
        },
        typeInput: {
          id: 'lg.application:draft.advert.typeInput',
          defaultMessage: 'Tegund auglýsingar',
          description: 'Tegund auglýsingar',
        },
        categoryInput: {
          id: 'lg.application:draft.advert.categoryInput',
          defaultMessage: 'Flokkur auglýsingar',
          description: 'Flokkur auglýsingar',
        },
      }),
      signature: defineMessages({
        formTitle: {
          id: 'lg.application:draft.signature.formTitle',
          defaultMessage: 'Undirskrift',
          description: 'Titill á formi fyrir undirskrift',
        },
        location: {
          id: 'lg.application:draft.signature.location',
          defaultMessage: 'Staðsetning',
          description: 'Titill á staðsetningu fyrir undirskrift',
        },
        date: {
          id: 'lg.application:draft.signature.date',
          defaultMessage: 'Dagsetning',
          description: 'Titill á dagsetningu fyrir undirskrift',
        },
        name: {
          id: 'lg.application:draft.signature.name',
          defaultMessage: 'Nafn',
          description: 'Titill á nafni fyrir undirskrift',
        },
        onBehalfOf: {
          id: 'lg.application:draft.signature.onBehalfOf',
          defaultMessage: 'Fyrir hönd',
          description: 'Titill á fyrir hönd fyrir undirskrift',
        },
        namePlaceholder: {
          id: 'lg.application:draft.signature.namePlaceholder',
          defaultMessage: 'Nafn undirritunar',
          description: 'Titill á nafni fyrir undirskrift',
        },
        locationPlaceholder: {
          id: 'lg.application:draft.signature.locationPlaceholder',
          defaultMessage: 'Staðsetning undirritunar',
          description: 'Titill á staðsetningu fyrir undirskrift',
        },
        onBehalfOfPlaceholder: {
          id: 'lg.application:draft.signature.onBehalfOfPlaceholder',
          defaultMessage: 'Fyrir hönd undirritunar',
          description: 'Titill á fyrir hönd fyrir undirskrift',
        },
      }),
      publishing: defineMessages({
        sectionTitle: {
          id: 'lg.application:draft.publishing.sectionTitle',
          defaultMessage: 'Birting',
          description: 'Heiti kafla fyrir birtingu auglýsingar',
        },
        formTitle: {
          id: 'lg.application:draft.publishing.formTitle',
          defaultMessage: 'Birting',
          description: 'Titill á formi fyrir birtingu auglýsingar',
        },
        formIntro: {
          id: 'lg.application:draft.publishing.formIntro',
          defaultMessage:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet mattis erat, eget dignissim lacus. Cras id enim ac urna bibendum gravida. Donec ultricies dapibus lacinia. Curabitur ut est urna. Donec id eleifend erat. Nam et posuere arcu.',
          description: 'Inngangur á formi fyrir birtingu auglýsingar',
        },
        radioNoSpecificDate: {
          id: 'lg.application:draft.publishing.radioNoSpecificDate',
          defaultMessage: 'Engin ósk um birtingardag',
          description: 'Titill á radio fyrir birtingu auglýsingar',
        },
        radioSpecificDate: {
          id: 'lg.application:draft.publishing.radioSpecificDate',
          defaultMessage: 'Ósk um birtingu',
          description: 'Titill á radio fyrir birtingu auglýsingar',
        },
        datePickerType: {
          id: 'lg.application:draft.publishing.datePickerType',
          defaultMessage: 'Tegund birtingar',
          description: 'Titill á dagatali fyrir birtingu auglýsingar',
        },
        datePickerDescription: {
          id: 'lg.application:draft.publishing.datePickerDescription',
          defaultMessage: 'Hvenær viltu að auglýsing birtist?',
          description: 'Lýsing á dagatali fyrir birtingu auglýsingar',
        },
        dateRepeaterTitle: {
          id: 'lg.application:draft.publishing.dateRepeaterTitle',
          defaultMessage: 'Dagsetning birtingar',
          description: 'Titill á dagatali fyrir birtingu auglýsingar',
        },
        dateRepeaterSaveButton: {
          id: 'lg.application:draft.publishing.dateRepeaterSaveButton',
          defaultMessage: 'Vista dagsetningu',
          description: 'Titill á takka fyrir birtingu auglýsingar',
        },
        dateRepeaterAddButton: {
          id: 'lg.application:draft.publishing.dateRepeaterAddButton',
          defaultMessage: 'Bæta við dagsetningu',
          description: 'Titill á takka fyrir birtingu auglýsingar',
        },
        dateRepeaterRemoveButton: {
          id: 'lg.application:draft.publishing.dateRepeaterRemoveButton',
          defaultMessage: 'Fjarlægja birtingardag',
          description: 'Titill á takka fyrir birtingu auglýsingar',
        },
        datePickerLabel: {
          id: 'lg.application:draft.publishing.datePickerLabel',
          defaultMessage: 'Birtingardagur',
          description: 'Titill á dagatali fyrir birtingu auglýsingar',
        },
        datePickerPlaceholder: {
          id: 'lg.application:draft.publishing.datePickerPlaceholder',
          defaultMessage: 'Veldu dagsetningu',
          description: 'Placeholder á dagatali fyrir birtingu auglýsingar',
        },
        checkboxNoSpecificDate: {
          id: 'lg.application:draft.publishing.checkboxNoSpecificDate',
          defaultMessage: 'Ég hef enga sérstaka ósk um birtingardag',
          description: 'Titill á checkboxi fyrir birtingu auglýsingar',
        },
        checkboxReceiveEmailDescription: {
          id: 'lg.application:draft.publishing.checkboxReceiveEmailDescription',
          defaultMessage: 'Annað',
          description: 'Titill á textaheiti fyrir birtingu auglýsingar',
        },
        checkboxReceiveEmail: {
          id: 'lg.application:draft.publishing.checkboxReceiveEmail',
          defaultMessage:
            'Fá tilkynningu í tölvupósti þegar auglýsing er útgefin',
          description: 'Titill á checkboxi fyrir birtingu auglýsingar',
        },
      }),
      communication: defineMessages({
        formTitle: {
          id: 'lg.application:draft.communication.formTitle',
          defaultMessage: 'Samskiptaleiðir',
          description: 'Heiti kafla fyrir tengilið',
        },
        formIntro: {
          id: 'lg.application:draft.communication.formIntro',
          defaultMessage:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet mattis erat, eget dignissim lacus. Cras id enim ac urna bibendum gravida.',
          description: 'Inngangur á formi fyrir tengilið',
        },
        addChannelButton: {
          id: 'lg.application:draft.communication.addChannelButton',
          defaultMessage: 'Bæta við samskiptaleið',
          description: 'Titill á takka fyrir tengilið',
        },
        emailColumn: {
          id: 'lg.application:draft.communication.emailColumn',
          defaultMessage: 'Netfang',
          description: 'Titill á dálki fyrir tengilið',
        },
        phoneColumn: {
          id: 'lg.application:draft.communication.phoneColumn',
          defaultMessage: 'Símanúmer',
          description: 'Titill á dálki fyrir tengilið',
        },
        cancel: {
          id: 'lg.application:draft.communication.cancel',
          defaultMessage: 'Hætta við',
          description: 'Titill á takka fyrir tengilið',
        },
        save: {
          id: 'lg.application:draft.communication.save',
          defaultMessage: 'Vista breytingar',
          description: 'Titill á takka fyrir tengilið',
        },
        removeButton: {
          id: 'lg.application:draft.communication.removeButton',
          defaultMessage: 'Fjarlægja samskiptaleið',
          description: 'Titill á takka fyrir samskiptaleið',
        },
        editButton: {
          id: 'lg.application:draft.communication.editButton',
          defaultMessage: 'Breyta samskiptaleið',
          description: 'Titill á takka fyrir samskiptaleið',
        },
      }),
      preview: defineMessages({
        sectionTitle: {
          id: 'lg.application:draft.preview.sectionTitle',
          defaultMessage: 'Forskoðun',
          description: 'Heiti kafla fyrir forskoðun auglýsingar',
        },
        formTitle: {
          id: 'lg.application:draft.preview.formTitle',
          defaultMessage: 'Forskoðun á birtingu',
          description: 'Titill á formi fyrir forskoðun auglýsingar',
        },
        formIntro: {
          id: 'lg.application:draft.preview.formIntro',
          defaultMessage:
            'Athugið að auglýsingin er ekki gefin út fyrr en eftir greiðslu og yfirferð ritstjóra.',
          description: 'Inngangur á formi fyrir forskoðun auglýsingar',
        },
        estimatedPublicationDate: {
          id: 'lg.application:draft.preview.estimatedPublicationDate',
          defaultMessage: 'Áætlaður útgáfud.:',
          description: 'Titill á áætluðum birtingardegi',
        },
      }),
      confirmation: defineMessages({
        category: {
          id: 'lg.application:draft.confirmation.category',
          defaultMessage: 'Tegund auglýsingar',
          description:
            'Titill á tegund auglýsingar fyrir staðfestingu auglýsingar',
        },
        sectionTitle: {
          id: 'lg.application:draft.confirmation.sectionTitle',
          defaultMessage: 'Staðfesting',
          description: 'Heiti kafla fyrir staðfestingu auglýsingar',
        },
        formTitle: {
          id: 'lg.application:draft.confirmation.formTitle',
          defaultMessage: 'Staðfesting',
          description: 'Titill á formi fyrir staðfestingu auglýsingar',
        },
        formIntro: {
          id: 'lg.application:draft.confirmation.formIntro',
          defaultMessage:
            'Með því að senda auglýsingu til birtingar staðfestir þú eftirfarandi forsendur og felur Lögbirting að undirbúa útgáfu hennar.',
          description: 'Inngangur á formi fyrir staðfestingu auglýsingar',
        },
        infoTitle: {
          id: 'lg.application:draft.confirmation.infoTitle',
          defaultMessage: 'Vinsamlegast athugið!',
          description: 'Titill á upplýsingum fyrir staðfestingu auglýsingar',
        },
        infoMessage: {
          id: 'lg.application:draft.confirmation.info',
          defaultMessage:
            'Athugið að auglýsingin er ekki gefin út fyrr en eftir greiðslu og yfirferð ritstjóra.',
          description: 'Titill á upplýsingum fyrir staðfestingu auglýsingar',
        },
        sender: {
          id: 'lg.application:draft.confirmation.sender',
          defaultMessage: 'Sendandi',
          description: 'Titill á umsækjanda fyrir staðfestingu auglýsingar',
        },
        type: {
          id: 'lg.application:draft.confirmation.type',
          defaultMessage: 'Tegund',
          description: 'Titill á tegund fyrir staðfestingu auglýsingar',
        },
        applicationType: {
          id: 'lg.application:draft.confirmation.applicationType',
          defaultMessage: 'Almenn umsókn',
          description: 'Titill á umsóknarheiti fyrir staðfestingu auglýsingar',
        },
        publicationDate: {
          id: 'lg.application:draft.confirmation.publicationDate',
          defaultMessage: 'Útgáfudagur',
          description: 'Titill á útgáfudegi fyrir staðfestingu auglýsingar',
        },
        noPublicationDate: {
          id: 'lg.application:draft.confirmation.noPublicationDate',
          defaultMessage: 'Engin ósk um birtingardag',
          description: 'Titill á útgáfudegi fyrir staðfestingu auglýsingar',
        },
        previewButton: {
          id: 'lg.application:draft.confirmation.previewButton',
          defaultMessage: 'Efni auglýsingar',
          description: 'Titill á takka fyrir forskoðun auglýsingar',
        },
        communicationChannel: {
          id: 'lg.application:draft.confirmation.communicationChannel',
          defaultMessage: 'Samskiptaleið',
          description: 'Titill á samskiptaleið fyrir staðfestingu auglýsingar',
        },
        submitButton: {
          id: 'lg.application:draft.confirmation.submitButton',
          defaultMessage: 'Staðfesta og senda inn auglýsingu',
          description: 'Titill á takka fyrir staðfestingu auglýsingar',
        },
      }),
    },
  },
  submitted: {
    success: defineMessages({
      sectionTitle: {
        id: 'lg.application:submitted.success.sectionTitle',
        defaultMessage: 'Innsend',
        description: 'Heiti kafla fyrir staðfestingu umsóknar',
      },
      formTitle: {
        id: 'lg.application:submitted.success.formTitle',
        defaultMessage: 'Innsend',
        description: 'Titill á formi fyrir staðfestingu umsóknar',
      },
      applicationReceived: {
        id: 'lg.application:submitted.success.applicationReceived',
        defaultMessage: 'Umsókn móttekin',
        description: 'Titill á staðfestingu umsóknar',
      },
      formIntro: {
        id: 'lg.application:submitted.success.formIntro',
        defaultMessage:
          'Umsóknin hefur borist til ritstjórnar Lögbirtingarblaðsins',
        description: 'Inngangur á formi fyrir staðfestingu umsóknar',
      },
    }),
    failed: defineMessages({
      sectionTitle: {
        id: 'lg.application:submitted.failed.sectionTitle',
        defaultMessage: 'Innsending',
        description: 'Heiti kafla fyrir staðfestingu umsóknar',
      },
      formTitle: {
        id: 'lg.application:submitted.failed.formTitle',
        defaultMessage: 'Eitthvað fór úrskeiðis',
        description: 'Titill á formi fyrir staðfestingu umsóknar',
      },
      alertTitle: {
        id: 'lg.application:submitted.failed.alertTitle',
        defaultMessage: 'Ekki tókst að senda inn umsókn',
        description: 'Titill á villu fyrir staðfestingu umsóknar',
      },
      alertMessage: {
        id: 'lg.application:submitted.failed.alertMessage',
        defaultMessage:
          'Ekki tókst að ná sambandi við vefþjóna Lögbirtingarblaðsins. Vinsamlegast reyndu aftur síðar.',
        description: 'Inngangur á formi fyrir staðfestingu umsóknar',
      },
      tryAgain: {
        id: 'lg.application:submitted.failed.tryAgain',
        defaultMessage: 'Reyndu aftur',
        description: 'Titill á takka fyrir staðfestingu umsóknar',
      },
    }),
  },
  approved: defineMessages({
    sectionTitle: {
      id: 'lg.application:approved.section.title',
      defaultMessage: 'Umsókn lokið',
      description: 'Heiti kafla fyrir staðfestingu umsóknar',
    },
    formTitle: {
      id: 'lg.application:approved.form.title',
      defaultMessage: 'Umsóknin lokið',
      description: 'Titill á formi fyrir staðfestingu umsóknar',
    },
    formSubtitle: {
      id: 'lg.application:approved.form.subtitle',
      defaultMessage: 'Umsóknin hefur verið samþykkt',
      description: 'Undirtitill á formi fyrir staðfestingu umsóknar',
    },
    formIntro: {
      id: 'lg.application:approved.form.intro',
      defaultMessage:
        'Umsóknin hefur lokið vinnslu og auglýsing birt í Lögbirtingablaðinu',
      description: 'Inngangur á formi fyrir staðfestingu umsóknar',
    },
    newApplication: {
      id: 'lg.application:approved.newApplication',
      defaultMessage: 'Ný umsókn',
      description: 'Titill á takka fyrir nýja umsókn',
    },
    overview: {
      id: 'lg.application:approved.overview',
      defaultMessage: 'Yfirlit',
      description: 'Titill á takka fyrir yfirlit umsókna',
    },
  }),
  rejected: defineMessages({
    sectionTitle: {
      id: 'lg.application:approved.rejected.sectionTitle',
      defaultMessage: 'Umsókn hafnað',
      description: 'Heiti kafla fyrir staðfestingu umsóknar',
    },
    formTitle: {
      id: 'lg.application:approved.rejected.formTitle',
      defaultMessage: 'Umsókn hafnað',
      description: 'Titill á formi fyrir staðfestingu umsóknar',
    },
    formIntro: {
      id: 'lg.application:approved.rejected.formIntro',
      defaultMessage:
        'Umsóknin hefur verið hafnað, fyrir frekari upplýsingar hafðu samband við Lögbirtingablaðið.',
      description: 'Inngangur á formi fyrir staðfestingu umsóknar',
    },
  }),
}
