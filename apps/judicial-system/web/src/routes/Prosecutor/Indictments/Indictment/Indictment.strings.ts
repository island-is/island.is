import { Gender } from '@island.is/judicial-system-web/src/graphql/schema'

export const strings = {
      heading: 'Ákæra',
    indictmentIntroductionTitle: 'Inngangur',
    indictmentIntroductionLabel: 'Inngangur',
    indictmentIntroductionPlaceholder: 'Hver höfðar sakamál á hendur hverjum?',
    indictmentIntroductionAutofillAnnounces: 'gjörir kunnugt:',
    indictmentIntroductionAutofillCourt: 'Að höfða ber sakamál fyrir {court} á hendur',
    indictmentIntroductionAutofillDefendant: '{defendantName}, kt. {defendantNationalId},',
    indictmentCountHeading: 'Ákæruliður {count}',
    addIndictmentCount: 'Bæta við ákærulið',
    demandsTitle: 'Refsikrafa',
    demandsRequestSuspension: 'Krefjast sviptingar',
    demandsLabel: 'Refsikrafa',
    demandsPlaceholder: 'Þess er krafist að...',
    pdfButtonIndictment: 'Ákæra - PDF',
    civilDemandsTitle: 'Einkaréttarkrafa',
    civilDemandsLabel: 'Einkaréttarkrafa',
    civilDemandsPlaceholder: 'Hver er krafa kröfuhafa?',
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
