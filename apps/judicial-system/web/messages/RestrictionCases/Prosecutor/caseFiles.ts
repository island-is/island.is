import { defineMessage, defineMessages } from 'react-intl'

export const rcCaseFiles = {
  heading: defineMessage({
    id: 'judicial.system.restriction_cases:case_files.heading',
    defaultMessage: 'Rannsóknargögn',
    description:
      'Notaður sem titill á rannsóknargagna skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  sections: {
    description: defineMessages({
      heading: {
        id: 'judicial.system.restriction_cases:case_files.description.heading',
        defaultMessage: 'Meðferð gagna',
        description:
          'Notaður sem titill fyrir "meðferð gagna" hlutann á rannsóknargagna skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      list: {
        id:
          'judicial.system.restriction_cases:case_files.description.list#markdown',
        defaultMessage:
          '- Hér er hægt að hlaða upp rannsóknargögnum til að sýna dómara.\\n\\n- Gögnin eru eingöngu aðgengileg dómara í málinu og aðgengi að þeim lokast þegar dómari hefur úrskurðað.\\n\\n- Gögnin verða ekki lögð fyrir eða flutt í málakerfi dómstóls nema annar hvor aðilinn kæri úrskurðinn.',
        description:
          'Listi yfir það hvernig rannsóknargögn eru geymd og hver hefur aðgang að þeim.',
      },
    }),
    files: defineMessages({
      heading: {
        id: 'judicial.system.restriction_cases:case_files.files.heading',
        defaultMessage: 'Rannsóknargögn',
        description:
          'Notaður sem titill fyrir "rannsóknargögn" hlutann á rannsóknargagna skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id: 'judicial.system.restriction_cases:case_files.files.label',
        defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
        description:
          'Notaður sem titill í "rannsóknargögn" skjalaboxi á rannsóknargagna skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      buttonLabel: {
        id: 'judicial.system.restriction_cases:case_files.files.buttonLabel',
        defaultMessage: 'Velja skjöl til að hlaða upp',
        description:
          'Notaður sem titill í "velja gögn til að hlaða upp" takka á rannsóknargagna skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    policeCaseFiles: defineMessages({
      heading: {
        id:
          'judicial.system.restriction_cases:case_files.police_case_files.heading',
        defaultMessage: 'Gögn úr LÖKE-máli {policeCaseNumber}',
        description:
          'Notaður sem titill fyrir "LOKE" gagnapakkann á rannsóknargagna skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      selectAllLabel: {
        id:
          'judicial.system.restriction_cases:case_files.police_case_files.select_all_label',
        defaultMessage: 'Velja allt',
        description:
          'Notaður sem texti fyrir "Velja allt" valmöguleikann í LÖKE gagnapakkanum á rannsóknargagna skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      errorMessage: {
        id:
          'judicial.system.restriction_cases:case_files.police_case_files.error_message',
        defaultMessage: 'Upp kom óvænt kerfisvilla',
        description:
          'Notaður sem villuskilaboð í LÖKE gagnapakkanum á rannsóknargagna skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      allFilesUploadedMessage: {
        id:
          'judicial.system.restriction_cases:case_files.police_case_files.all_files_uploaded',
        defaultMessage: 'Öllum skjölum hefur verið hlaðið upp',
        description:
          'Notaður sem skilaboð þegar öllum skjölum hefur verið hlaðið upp í LÖKE gagnapakkanum á rannsóknargagna skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      uploadButtonLabel: {
        id:
          'judicial.system.restriction_cases:case_files.police_case_files.upload_button_label',
        defaultMessage: 'Hlaða upp',
        description:
          'Notaður sem texti í "hlaða upp" takka í LÖKE gagnapakkanum á rannsóknargagna skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    comments: defineMessages({
      heading: {
        id: 'judicial.system.restriction_cases:case_files.comments.heading',
        defaultMessage: 'Athugasemdir vegna rannsóknargagna',
        description:
          'Notaður sem titill fyrir "athugasemdir vegna rannsóknargagna" hlutann á rannsóknargagna skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id: 'judicial.system.restriction_cases:case_files.comments.tooltip',
        defaultMessage:
          'Hér er hægt að skrá athugasemdir til dómara og dómritara varðandi rannsóknargögnin.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "athugasemdir vegna rannsóknargagna" titil á rannsóknargagna skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id: 'judicial.system.restriction_cases:case_files.comments.label',
        defaultMessage: 'Skilaboð',
        description:
          'Notaður sem titill í "skilaboð" textaboxi á rannsóknargagna skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id: 'judicial.system.restriction_cases:case_files.comments.placeholder',
        defaultMessage:
          'Er eitthvað sem þú vilt koma á framfæri við dómstólinn varðandi gögnin?',
        description:
          'Notaður sem skýritexti í "skilaboð" textaboxi á rannsóknargagna skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
}
