import { defineMessage, defineMessages } from 'react-intl'

export const icRuling = {
  title: defineMessage({
    id: 'judicial.system.core:investigation_cases.ruling.title',
    defaultMessage: 'Úrskurður',
    description: 'Notaður sem titill á úrskurðar skrefi í rannsóknarheimildum.',
  }),
  sections: {
    alertMessage: defineMessages({
      title: {
        id:
          'judicial.system.core:core:investigation_cases.ruling.sections.alert_message.title',
        defaultMessage: 'Athugið',
        description:
          'Notaður sem titill í viðvörunarboxi þegar verið er að leiðrétta úrskurð',
      },
      message: {
        id:
          'judicial.system.core:investigation_cases.ruling.sections.alert_message.message',
        defaultMessage:
          'Allar breytingar á textum verða sýnilegar í yfirliti málsins, hvort sem nýr úrskurður er undirritaður eða ekki.',
        description:
          'Notaður sem texti í viðvörunarboxi þegar verið er að leiðrétta úrskurð',
      },
    }),
    courtCaseFacts: defineMessages({
      title: {
        id:
          'judicial.system.core:investigation_cases.ruling.court_case_facts.title',
        defaultMessage: 'Greinargerð um málsatvik',
        description:
          'Notaður sem titill fyrir "greinargerð um málsatvik" hlutann á úrskurðar skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.core:investigation_cases.ruling.court_case_facts.tooltip',
        defaultMessage:
          'Greinargerð lögreglu er forbókuð hér fyrir neðan. Hægt er að breyta textanum og mun hann birtast með þeim hætti í úrskurði dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um málsatvik" titlinn á úrskurðar skrefi í rannsóknarheimildum.',
      },
      label: {
        id:
          'judicial.system.core:investigation_cases.ruling.court_case_facts.label',
        defaultMessage: 'Greinargerð um málsatvik',
        description:
          'Notaður sem titill fyrir "greinargerð um málsatvik" innsláttarsvæðið á úrskurðar skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.core:investigation_cases.ruling.court_case_facts.placeholder',
        defaultMessage:
          'Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?',
        description:
          'Notaður sem skýritexti fyrir "greinargerð um málsatvik" innsláttarsvæðið á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),
    courtLegalArguments: defineMessages({
      title: {
        id:
          'judicial.system.core:investigation_cases.ruling.court_legal_arguments.title',
        defaultMessage: 'Greinargerð um lagarök',
        description:
          'Notaður sem titill fyrir "Greinargerð um lagarök" hlutann á úrskurðar skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.core:investigation_cases.ruling.court_legal_arguments.tooltip',
        defaultMessage:
          'Greinargerð lögreglu er forbókuð hér fyrir neðan. Hægt er að breyta textanum og mun hann birtast með þeim hætti í úrskurði dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um lagarök" titlinn á úrskurðar skrefi í rannsóknarheimildum.',
      },
      label: {
        id:
          'judicial.system.core:investigation_cases.ruling.court_legal_arguments.label',
        defaultMessage: 'Greinargerð um lagarök',
        description:
          'Notaður sem titill fyrir "Lagarök" innsláttarsvæðið á úrskurðar skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.core:investigation_cases.ruling.court_legal_arguments.placeholder',
        defaultMessage:
          'Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?',
        description:
          'Notaður sem skýritexti fyrir "greinargerð um málsatvik" innsláttarsvæðið á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),
    conclusion: defineMessages({
      title: {
        id: 'judicial.system.core:investigation_cases.ruling.conclusion.title',
        defaultMessage: 'Úrskurðarorð',
        description:
          'Notaður sem titill fyrir "Úrskurðarorð" hlutann á úrskurðar skrefi í rannsóknarheimildum.',
      },
      label: {
        id: 'judicial.system.core:investigation_cases.ruling.conclusion.label',
        defaultMessage: 'Úrskurðarorð',
        description:
          'Notaður sem titill fyrir "Úrskurðarorð" innsláttarsvæði á úrskurðar skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.core:investigation_cases.ruling.conclusion.placeholder',
        defaultMessage: 'Hver eru úrskurðarorðin',
        description:
          'Notaður sem placeholder fyrir "Úrskurðarorð" innsláttarsvæði á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),
    decision: defineMessages({
      title: {
        id: 'judicial.system.core:investigation_cases.ruling.decision.title',
        defaultMessage: 'Úrskurður',
        description:
          'Notaður sem titill fyrir "Úrskurður" hlutann á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),

    introduction: defineMessages({
      title: {
        id:
          'judicial.system.core:investigation_cases.ruling.sections.introduction.title',
        defaultMessage: 'Aðfararorð',
        description:
          'Titill sem titill fyrir "Aðfararorð" hlutann í rannsóknarheimildum.',
      },
      label: {
        id:
          'judicial.system.core:investigation_cases.ruling.introduction.label',
        defaultMessage: 'Aðfararorð',
        description:
          'Notaður sem titill fyrir í "Aðfararorð" textaboxi á úrskurðar skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.core:investigation_cases.ruling.introduction.placeholder',
        defaultMessage:
          'Hér er m.a. unnt að greina frá því hvaða dag krafa var tekin fyrir og/eða tekin til úrskurðar.',
        description:
          'Notaður sem skýritexti fyrir í "Aðfararorð" textabox á úrskurðar skrefi í rannsóknarheimildum.',
      },
      autofill: {
        id:
          'judicial.system.core:investigation_cases.ruling.introduction.autofill',
        defaultMessage: 'Mál þetta var tekið til úrskurðar {date}.',
        description:
          'Notaður sem sjálfgefinn texti í "Aðfararorð" textabox á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),
    prosecutorDemands: defineMessages({
      title: {
        id:
          'judicial.system.core:investigation_cases.ruling.prosecutor_demands.title',
        defaultMessage: 'Dómkröfur',
        description:
          'Notaður sem titill fyrir "dómkröfur" hlutann á úrskurðar skrefi í rannsóknarheimildum.',
      },
      label: {
        id:
          'judicial.system.core:investigation_cases.ruling.prosecutor_demands.label',
        defaultMessage: 'Krafa lögreglu',
        description:
          'Notaður sem titill fyrir í "Krafa lögreglu" textaboxi á úrskurðar skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.core:investigation_cases.ruling.prosecutor_demands.placeholder',
        defaultMessage: 'Hvað hafði ákæruvaldið að segja?',
        description:
          'Notaður sem skýritexti fyrir í "Hvað hafði ákæruvaldið að segja?" textabox á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),
    ruling: defineMessages({
      title: {
        id: 'judicial.system.core:investigation_cases.ruling.ruling.title',
        defaultMessage: 'Niðurstaða',
        description:
          'Notaður sem titill fyrir "Niðurstaða" hlutann á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),
    formFooter: defineMessages({
      modifyRulingButtonLabel: {
        id:
          'judicial.system.core:investigation_cases.ruling.form_footer.modify_ruling_button_label',
        defaultMessage: 'Undirrita nýjan úrskurð',
        description:
          'Notaður sem label á hnappinn "Halda áfram" í úrskurðar skrefi þegar úrskuður er leiðréttur.',
      },
    }),
  },
}
