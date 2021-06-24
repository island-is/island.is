import { defineMessages } from 'react-intl'

export const complainedFor = {
  general: defineMessages({
    complainedForInformationTitle: {
      id: 'ctao.application:complainee.general.complainedForInformationTitle',
      defaultMessage: 'Upplýsingar um þann sem þú kvartar fyrir',
      description: 'Title about whom is complained for',
    },
    complainedForInformationConnection: {
      id:
        'ctao.application:complainee.general.complainedForInformationConnection',
      defaultMessage: 'Hver eru tengsl við þann aðila',
      description:
        'Title about how the user is connected to the person being complained for',
    },
  }),
  decision: defineMessages({
    title: {
      id: 'ctao.application:complainedFor.decision.title',
      defaultMessage: 'Fyrir hvern er verið að kvarta?',
      description: 'Title about decision, you or someone else',
    },
    description: {
      id: 'ctao.application:complainedFor.decision.description',
      defaultMessage: `Almennt getur maður ekki kvartað til 
				umboðsmanns Alþingis yfir því að aðrir hafi verið 
				beittir rangsleitni af hálfu stjórnvalda. Ef maður 
				hefur sérstök tengsl við þann sem ákvörðun eða 
				athöfn stjórnvalds sem kvörtunin lýtur að er hægt 
				að kvarta fyrir hans hönd. Þá þarf að koma fram 
				hver séu tengsl milli þess sem kvartar og þess sem 
				kvörtunin varðar, t.d. ef um er að ræða foreldri. 
				Eftir atvikum er líka rétt að senda skriflegt umboð, 
				t.d. ef vinur gætir hagsmuna þess sem kvörtunin varðar.`,
      description: 'description about decision, you or someone else',
    },
    myselfLabel: {
      id: 'ctao.application:complainedFor.decision.myself',
      defaultMessage: 'Mig',
      description: 'Label for myself',
    },
    someoneelseLabel: {
      id: 'ctao.application:complainedFor.decision.someoneelse',
      defaultMessage: 'Annan',
      description: 'Label for someone else',
    },
  }),
  information: defineMessages({
    title: {
      id: 'ctao.application:complainedFor.information.title',
      defaultMessage: 'Upplýsingar um þann sem þú kvartar fyrir',
      description: 'Title about whom is complained for',
    },
    fieldTitle: {
      id: 'ctao.application:complainedFor.information.fieldTitle',
      defaultMessage: 'Hver eru tengsl við þann aðila',
      description:
        'Title about how the user is connected to the person being complained for',
    },
    textareaTitle: {
      id: 'ctao.application:complainedFor.information.textareaTitle',
      defaultMessage: 'Tengsl við þriðja aðila',
      description: 'Title of textarea in complained for information',
    },
    textareaPlaceholder: {
      id: 'ctao.application:complainedFor.information.textareaPlaceholder',
      defaultMessage: 'Stutt lýsing..',
      description:
        'Placeholder text for textarea in complained for information',
    },
  }),
}
