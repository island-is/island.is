export const rcDemands = {
  heading: 'Dómkröfur og lagagrundvöllur',
  sections: {
    demands: {
      heading: 'Dómkröfur',
      isolation: 'Krafa um einangrun',
      admissionToAppropriateFacility: 'Vistun á viðeigandi stofnun',
      admissionToAppropriateFacilityTooltip:
        'Með því að haka hér breytist málið í kröfu um vistun á viðeigandi stofnun og öll gögn þess munu taka mið af því.',
      tooltip:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
      pastRestriction:
        '{caseType, select, ADMISSION_TO_FACILITY {Fyrri vistun} TRAVEL_BAN {Fyrra farbann} other {Fyrri gæsla}} var/er til ',
      restrictionValidDateLabel:
        '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} TRAVEL_BAN {Farbann} other {Gæsluvarðhald}} til',
    },
    lawsBroken: {
      heading: 'Lagaákvæði sem brot varða við',
      placeholder:
        'Skrá inn þau lagaákvæði sem brotið varðar við, til dæmis 1. mgr. 244 gr. almennra hegningarlaga nr. 19/1940...',
    },
    legalBasis: {
      heading: 'Lagaákvæði sem krafan er byggð á',
      legalBasisLabel: 'Önnur lagaákvæði sem krafan er byggð á',
      legalBasisPlaceholder:
        'Ef krafan byggir á öðrum lagaákvæðum er hægt að skrá þau hér.',
    },
    custodyRestrictions: {
      headingV2:
        'Takmarkanir og tilhögun {caseType, select, ADMISSION_TO_FACILITY {vistunar} TRAVEL_BAN {farbanns} other {gæslu}}',
      subHeadingV2:
        'Ef ekkert er valið er {caseType, select, ADMISSION_TO_FACILITY {vistun} TRAVEL_BAN {farbann} other {gæsla}} án takmarkana',
      label: 'Nánari útlistun eða aðrar takmarkanir',
      placeholder: 'Til dæmis hvernig tilkynningarskyldu sé háttað...',
      requestedOtherRestrictionsAutofill:
        'Sækjandi tekur fram að farbannið verði með takmörkunum, að varnaraðila verði gert að tilkynna sig.',
    },
  },
}
