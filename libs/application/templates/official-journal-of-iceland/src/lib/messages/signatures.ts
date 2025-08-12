import { defineMessages } from 'react-intl'

export const signatures = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:signatures.general.title',
      defaultMessage: 'Texti undirritunarkafla',
      description: 'Title of the signatures section',
    },
    intro: {
      id: 'ojoi.application:signatures.general.intro',
      defaultMessage:
        'Hér má velja þá uppsetningu undirrritana sem best á við. Mikilvægt er að tryggja samræmi við frumtexta, til dæmis varðandi stað og dagsetningu.',
      description: 'Intro of the signatures section',
    },
    section: {
      id: 'ojoi.application:signatures.general.section',
      defaultMessage: 'Undirritunarkafl{abbreviation}',
      description: 'Title of the signatures section',
    },
  }),
  errors: defineMessages({
    lastSignature: {
      id: 'ojoi.application:signatures.errors.lastSignature',
      defaultMessage: 'Ekki tókst að sækja síðustu undirritun',
      description: 'Error message for missing last signature',
    },
  }),
  headings: defineMessages({
    signedBy: {
      id: 'ojoi.application:signatures.headings.signedBy',
      defaultMessage: 'Undirritað af',
      description: 'Signed by section heading',
    },
    additionalSignature: {
      id: 'ojoi.application:signatures.headings.additionalSignature',
      defaultMessage: 'Aukaundirritun',
      description: 'Additional signature section heading',
    },
    chairman: {
      id: 'ojoi.application:signatures.headings.chairman',
      defaultMessage: 'Formaður',
      description: 'Chairman section heading',
    },
    committeeMembers: {
      id: 'ojoi.application:signatures.headings.committeeMembers',
      defaultMessage: 'Nefndarmenn',
      description: 'Committee members section heading',
    },
    preview: {
      id: 'ojoi.application:signatures.headings.preview',
      defaultMessage: 'Sýnishorn',
      description: 'Preview signatures section heading',
    },
  }),
  tabs: defineMessages({
    regular: {
      id: 'ojoi.application:signatures.tabs.regular.label',
      defaultMessage: 'Hefðbundin undirritun',
      description: 'Label for the regular signature tab',
    },
    committee: {
      id: 'ojoi.application:signatures.tabs.committee.label',
      defaultMessage: 'Undirritun nefndar',
      description: 'Label for the committee signature tab',
    },
  }),
  buttons: defineMessages({
    copyLastSignature: {
      id: 'ojoi.application:signatures.buttons.copyLastSignature.label',
      defaultMessage: 'Afrita síðustu undirritun',
      description: 'Label for the copy old advert button',
    },
    addPerson: {
      id: 'ojoi.application:signatures.buttons.addPerson.label',
      defaultMessage: 'Bæta við persónu',
      description: 'Label for the add person button',
    },
    addInstitution: {
      id: 'ojoi.application:signatures.buttons.addInstitution.label',
      defaultMessage: 'Bæta við stað/stofnun',
      description: 'Label for the add institution button',
    },
    addCommitteeMember: {
      id: 'ojoi.application:signatures.buttons.addCommitteeMember.label',
      defaultMessage: 'Bæta við nefnd',
      description: 'Label for the add committee button',
    },
  }),
  inputs: {
    institution: defineMessages({
      label: {
        id: 'ojoi.application:signatures.inputs.institution.label',
        defaultMessage: 'Staður eða stofnun (þgf.)',
        description: 'Label for the institution input',
      },
      placeholder: {
        id: 'ojoi.application:signatures.inputs.institution.placeholder',
        defaultMessage: 'Nafn stofnunar eða staðsetning',
        description: 'Placeholder for the institution input',
      },
    }),
    date: defineMessages({
      label: {
        id: 'ojoi.application:signatures.inputs.date.label',
        defaultMessage: 'Dagsetning',
        description: 'Label for the date input',
      },
      placeholder: {
        id: 'ojoi.application:signatures.inputs.date.placeholder',
        defaultMessage: '01.02.2024',
        description: 'Placeholder for the date input',
      },
    }),
    name: defineMessages({
      label: {
        id: 'ojoi.application:signatures.inputs.name.label',
        defaultMessage: 'Nafn',
        description: 'Label for the name input',
      },
      placeholder: {
        id: 'ojoi.application:signatures.inputs.name.placeholder',
        defaultMessage: 'Nafn',
        description: 'Placeholder for the name input',
      },
    }),
    above: defineMessages({
      label: {
        id: 'ojoi.application:signatures.inputs.above.label',
        defaultMessage: 'Texti yfir',
        description: 'Label for the above input',
      },
    }),
    below: defineMessages({
      label: {
        id: 'ojoi.application:signatures.inputs.below.label',
        defaultMessage: 'Texti undir',
        description: 'Label for the below input',
      },
    }),
    after: defineMessages({
      label: {
        id: 'ojoi.application:signatures.inputs.after.label',
        defaultMessage: 'Texti eftir',
        description: 'Label for the after input',
      },
    }),
  },
}
