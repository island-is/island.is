import { defineMessages } from 'react-intl'

export const childrenNGuardiansMessages = {
  shared: defineMessages({
    sectionTitle: {
      id: 'nps.application:childrenNGuardians.shared.sectionTitle',
      defaultMessage: 'Börn og forsjáraðilar',
      description: 'Children and guardians',
    },
  }),
  childInfo: defineMessages({
    subSectionTitle: {
      id: 'nps.application:childrenNGuardians.childInfo.subSectionTitle',
      defaultMessage: 'Upplýsingar um barn',
      description: 'Information about child',
    },
    description: {
      id: 'nps.application:childrenNGuardians.childInfo.description',
      defaultMessage:
        'Upplýsingar um barn eru sóttar í Þjóðskrá. Athugaðu hvort upplýsingarnar séu réttar áður en þú heldur áfram.',
      description:
        'Information about the child is retrieved from the National Registry. Check that the information is correct before proceeding.',
    },
    preferredName: {
      id: 'nps.application:childrenNGuardians.childInfo.preferredName',
      defaultMessage: 'Valið nafn',
      description: 'Preferred name',
    },
    pronouns: {
      id: 'nps.application:childrenNGuardians.childInfo.pronouns',
      defaultMessage: 'Valið persónufornafn',
      description: 'Preferred personal pronoun',
    },
    pronounsPlaceholder: {
      id: 'nps.application:childrenNGuardians.childInfo.pronounsPlaceholder',
      defaultMessage: 'Veldu persónufornafn',
      description: 'Select a personal pronoun',
    },
    usePronounAndPreferredName: {
      id: 'nps.application:childrenNGuardians.childInfo.usePronounAndPreferredName',
      defaultMessage:
        'Barnið kýs að vera ávarpað með öðru nafni og/eða persónufornafni en hann eða hún',
      description:
        'The child prefers to be addressed by a name and/or personal pronoun other than he or she',
    },
    preferredNameTooltip: {
      id: 'nps.application:childrenNGuardians.childInfo.preferredNameTooltip',
      defaultMessage:
        'Forsjáraðilar geta óskað eftir breytingu á skráðu kyni og nafni barns hjá Þjóðskrá eða barnið sjálft sé það orðið 15 ára. Ef sú breyting er ótímabært má breyta nafni barnsins hér og skrá það nafn sem barn hefur valið sér.',
      description:
        "Guardians can request a change to a child's registered gender and name with the National Registry, or the child themselves if they have reached the age of 15. If the change is premature, the child's name can be changed here and the name the child has chosen can be registered.",
    },
  }),
  guardians: defineMessages({
    subSectionTitle: {
      id: 'nps.application:childrenNGuardians.guardians.subSectionTitle',
      defaultMessage: 'Forsjáraðilar',
      description: 'Guardians',
    },
    description: {
      id: 'nps.application:childrenNGuardians.guardians.description',
      defaultMessage:
        'Upplýsingar um forsjáraðila eru sóttar úr Þjóðskrá og af Mínum síðum á Ísland.is. Athugaðu hvort símanúmer og netföng séu rétt skráð áður en þú heldur áfram.',
      description:
        'Information about guardians is retrieved from Registers Iceland and from My Pages on Ísland.is. Check that phone numbers and email addresses are entered correctly before proceeding.',
    },
    guardian: {
      id: 'nps.application:childrenNGuardians.guardians.guardian',
      defaultMessage: 'Upplýsingar um forsjáraðila 1',
      description: 'Information about guardian 1',
    },
    otherGuardian: {
      id: 'nps.application:childrenNGuardians.guardians.otherGuardian',
      defaultMessage: 'Upplýsingar um forsjáraðila 2',
      description: 'Information about guardian 2',
    },
    requiresInterpreter: {
      id: 'nps.application:childrenNGuardians.guardians.requiresInterpreter',
      defaultMessage: 'Þarf forsjáraðili túlk?',
      description: 'Does the guardian need an interpreter?',
    },
  }),
  relatives: defineMessages({
    subSectionTitle: {
      id: 'nps.application:childrenNGuardians.relatives.subSectionTitle',
      defaultMessage: 'Aðstandendur',
      description: 'Relatives',
    },
    title: {
      id: 'nps.application:childrenNGuardians.relatives.title',
      defaultMessage: 'Aðstandendur barns',
      description: "The child's relatives",
    },
    description: {
      id: 'nps.application:childrenNGuardians.relatives.description',
      defaultMessage:
        'Aðstandandi er aðili sem er náinn fjölskyldunni og barni og veitir stuðning þegar svo ber við. Æskilegt er að skrá a.m.k. einn aðstandanda en einnig er hægt að koma þeim upplýsingum síðar til skólans. Þú getur bætt allt að fjórum aðilum. Vinsamlegast látið aðstandendur vita af skráningunni.',
      description:
        'A relative is a person who is close to the family and child and provides support when needed. It is preferable to register at least one relative, but that information can also be communicated to the school later. You can add up to four people. Please notify the relatives of the registration.',
    },
    registrationTitle: {
      id: 'nps.application:childrenNGuardians.relatives.registrationTitle',
      defaultMessage: 'Skráning aðstandanda',
      description: 'Registration of a relative',
    },
    addRelative: {
      id: 'nps.application:childrenNGuardians.relatives.addRelative',
      defaultMessage: 'Bæta við aðstandanda',
      description: 'Add a relative',
    },
    registerRelative: {
      id: 'nps.application:childrenNGuardians.relatives.registerRelative',
      defaultMessage: 'Skrá aðstandanda',
      description: 'Register relative',
    },
    deleteRelative: {
      id: 'nps.application:childrenNGuardians.relatives.deleteRelative',
      defaultMessage: 'Eyða aðstandanda',
      description: 'Remove relative',
    },
    editRelative: {
      id: 'nps.application:childrenNGuardians.relatives.editRelative',
      defaultMessage: 'Breyta aðstandanda',
      description: 'Edit relative',
    },
  }),
}
