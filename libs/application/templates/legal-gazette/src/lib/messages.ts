import { defineMessages } from 'react-intl'

export const m = {
  general: defineMessages({
    institution: {
      id: 'lg.application.general.institution',
      defaultMessage: 'Dómsmálaráðuneytið',
      description: `Stofnun umsóknar`,
    },
    application: {
      id: 'lg.application.general.application',
      defaultMessage: 'Lögbirting',
      description: `Heiti umsóknar`,
    },
  }),
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
  },
}
