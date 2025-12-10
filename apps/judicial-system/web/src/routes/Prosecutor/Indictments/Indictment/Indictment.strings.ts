import { defineMessages } from 'react-intl'

import { Gender } from '@island.is/judicial-system-web/src/graphql/schema'

export const strings = {
  ...defineMessages({
    heading: {
      id: 'judicial.system.core:indictments_indictment.heading',
      defaultMessage: 'Ákæra',
      description: 'Notaður sem titill á ákæra skrefi í ákærum.',
    },
    indictmentIntroductionTitle: {
      id: 'judicial.system.core:indictments_indictment.indictment_introduction_title',
      defaultMessage: 'Inngangur',
      description:
        'Notaður sem titill á Inngangur svæði á ákæra skrefi í ákærum.',
    },
    indictmentIntroductionLabel: {
      id: 'judicial.system.core:indictments_indictment.indictment_introduction_label',
      defaultMessage: 'Inngangur',
      description:
        'Notaður sem titill á Inngangur textasvæði á ákæra skrefi í ákærum.',
    },
    indictmentIntroductionPlaceholder: {
      id: 'judicial.system.core:indictments_indictment.indictment_introduction_placeholder',
      defaultMessage: 'Hver höfðar sakamál á hendur hverjum?',
      description:
        'Notaður sem skýritexti á Inngangur textasvæði á ákæra skrefi í ákærum.',
    },
    indictmentIntroductionAutofillAnnounces: {
      id: 'judicial.system.core:indictments_indictment.indictment_introduction_autofill_announces',
      defaultMessage: 'gjörir kunnugt:',
      description:
        'Notaður sem sjálfgefinn texti í Inngangur textasvæði á ákæra skrefi í ákærum.',
    },
    indictmentIntroductionAutofillCourt: {
      id: 'judicial.system.core:indictments_indictment.indictment_introduction_court',
      defaultMessage: 'Að höfða ber sakamál fyrir {court} á hendur',
      description:
        'Notaður sem sjálfgefinn texti í Inngangur textasvæði á ákæra skrefi í ákærum.',
    },
    indictmentIntroductionAutofillDefendant: {
      id: 'judicial.system.core:indictments_indictment.indictment_introduction_defendant_name_v1',
      defaultMessage: '{defendantName}, kt. {defendantNationalId},',
      description:
        'Notaður sem sjálfgefinn texti í Inngangur textasvæði á ákæra skrefi í ákærum.',
    },
    indictmentCountHeading: {
      id: 'judicial.system.core:indictments_indictment.indictment_count_heading',
      defaultMessage: 'Ákæruliður {count}',
      description: 'Notaður sem titill á ákærulið.',
    },
    addIndictmentCount: {
      id: 'judicial.system.core:indictments_indictment.add_indictment_count',
      defaultMessage: 'Bæta við ákærulið',
      description: 'Notaður sem texti á "Bæta við ákærulið" hnappi.',
    },
    demandsTitle: {
      id: 'judicial.system.core:indictments_indictment.demands_title',
      defaultMessage: 'Refsikrafa',
      description:
        'Notaður sem titill á Refsikrafa svæði á ákæra skrefi í ákærum.',
    },
    demandsRequestSuspension: {
      id: 'judicial.system.core:indictments_indictment.demands_request_suspesion',
      defaultMessage: 'Krefjast sviptingar',
      description:
        'Notaður sem titill á krejast sviptingar haki á ákæra skrefi í ákærum.',
    },
    demandsLabel: {
      id: 'judicial.system.core:indictments_indictment.demands_label',
      defaultMessage: 'Refsikrafa',
      description:
        'Notaður sem titill á Refsikrafa textasvæði á ákæra skrefi í ákærum.',
    },
    demandsPlaceholder: {
      id: 'judicial.system.core:indictments_indictment.demands_placeholder',
      defaultMessage: 'Þess er krafist að...',
      description:
        'Notaður sem skýritexti á Refsikrafa textasvæði á ákæra skrefi í ákærum.',
    },
    pdfButtonIndictment: {
      id: 'judicial.system.core:indictments_indictment.pdf_button_indictment',
      defaultMessage: 'Ákæra - PDF',
      description:
        'Notaður sem texti á hnappi til að sækja ákæru sem PDF skjal.',
    },
    civilDemandsTitle: {
      id: 'judicial.system.core:indictments_indictment.civil_demands_title',
      defaultMessage: 'Einkaréttarkrafa',
      description:
        'Notaður sem titill á Einkaréttarkrafa svæði á ákæra skrefi í ákærum.',
    },
    civilDemandsLabel: {
      id: 'judicial.system.core:indictments_indictment.civil_demands_label',
      defaultMessage: 'Einkaréttarkrafa',
      description:
        'Notaður sem titill á Einkaréttarkrafa textasvæði á ákæra skrefi í ákærum.',
    },
    civilDemandsPlaceholder: {
      id: 'judicial.system.core:indictments_indictment.civil_demands_placeholder',
      defaultMessage: 'Hver er krafa kröfuhafa?',
      description:
        'Notaður sem skýritexti á Einkaréttarkrafa textasvæði á ákæra skrefi í ákærum.',
    },
  }),
  demandsAutofill: {
    [Gender.MALE]:
      'Þess er krafist að ákærði verði dæmdur til refsingar og til greiðslu alls sakarkostnaðar.',
    [Gender.FEMALE]:
      'Þess er krafist að ákærða verði dæmd til refsingar og til greiðslu alls sakarkostnaðar.',
    [Gender.OTHER]:
      'Þess er krafist að ákært verði dæmt til refsingar og til greiðslu alls sakarkostnaðar.',
  },
  demandsAutofillWithUnderTheInfluenceLicenseSuspension: {
    [Gender.MALE]:
      'Þess er krafist að ákærði verði dæmdur til refsingar, til greiðslu alls sakarkostnaðar og til að sæta sviptingu ökuréttar skv. 99. gr. og 101. gr. laga nr. 77/2019.',
    [Gender.FEMALE]:
      'Þess er krafist að ákærða verði dæmd til refsingar, til greiðslu alls sakarkostnaðar og til að sæta sviptingu ökuréttar skv. 99. gr. og 101. gr. laga nr. 77/2019.',
    [Gender.OTHER]:
      'Þess er krafist að ákært verði dæmt til refsingar, til greiðslu alls sakarkostnaðar og til að sæta sviptingu ökuréttar skv. 99. gr. og 101. gr. laga nr. 77/2019.',
  },
  demandsAutofillWithSpeedingLicenseSuspension: {
    [Gender.MALE]:
      'Þess er krafist að ákærði verði dæmdur til refsingar, til greiðslu alls sakarkostnaðar og til að sæta sviptingu ökuréttar skv. 99. gr. laga nr. 77/2019.',
    [Gender.FEMALE]:
      'Þess er krafist að ákærða verði dæmd til refsingar, til greiðslu alls sakarkostnaðar og til að sæta sviptingu ökuréttar skv. 99. gr. laga nr. 77/2019.',
    [Gender.OTHER]:
      'Þess er krafist að ákært verði dæmt til refsingar, til greiðslu alls sakarkostnaðar og til að sæta sviptingu ökuréttar skv. 99. gr. laga nr. 77/2019.',
  },
  demandsAutofillWithFutureLicenseSuspension: {
    [Gender.MALE]:
      'Þess er krafist að ákærði verði dæmdur til refsingar, til greiðslu alls sakarkostnaðar og til að sæta sviptingu á réttinum til að öðlast ökuskírteini skv. 4. mgr. 58. gr. laga nr. 77/2019.',
    [Gender.FEMALE]:
      'Þess er krafist að ákærða verði dæmd til refsingar, til greiðslu alls sakarkostnaðar og til að sæta sviptingu á réttinum til að öðlast ökuskírteini skv. 4. mgr. 58. gr. laga nr. 77/2019.',
    [Gender.OTHER]:
      'Þess er krafist að ákært verði dæmt til refsingar, til greiðslu alls sakarkostnaðar og til að sæta sviptingu á réttinum til að öðlast ökuskírteini skv. 4. mgr. 58. gr. laga nr. 77/2019.',
  },
  demandsAutofillWithFutureLicenseAndUnderTheInfluenceSuspensions: {
    [Gender.MALE]:
      'Þess er krafist að ákærði verði dæmdur til refsingar, til greiðslu alls sakarkostnaðar, til að sæta sviptingu á réttinum til að öðlast ökuskírteini samkvæmt 4. mgr. 58. gr. laga nr. 77/2019 og til að sæta sviptingu ökuréttar skv. 99. gr. og 101. gr. laga nr. 77/2019.',
    [Gender.FEMALE]:
      'Þess er krafist að ákærða verði dæmd til refsingar, til greiðslu alls sakarkostnaðar, til að sæta sviptingu á réttinum til að öðlast ökuskírteini samkvæmt 4. mgr. 58. gr. laga nr. 77/2019 og til að sæta sviptingu ökuréttar skv. 99. gr. og 101. gr. laga nr. 77/2019.',
    [Gender.OTHER]:
      'Þess er krafist að ákært verði dæmt til refsingar, til greiðslu alls sakarkostnaðar, til að sæta sviptingu á réttinum til að öðlast ökuskírteini samkvæmt 4. mgr. 58. gr. laga nr. 77/2019 og til að sæta sviptingu ökuréttar skv. 99. gr. og 101. gr. laga nr. 77/2019.',
  },
}
