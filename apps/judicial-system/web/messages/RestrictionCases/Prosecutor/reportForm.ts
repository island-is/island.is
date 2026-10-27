// Strings for report form 'Greinargerð'
export const rcReportForm = {
  heading: 'Greinargerð',
  sections: {
    demands: {
      heading: 'Dómkröfutexti',
      label: 'Dómkröfur',
      autofill: 'Þess er krafist að {defendantName}{defendantDOB}sæti{isExtended, select, true { áframhaldandi} other {}} {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} TRAVEL_BAN {farbanni} other {gæsluvarðhaldi}} með úrskurði {court}, til {requestedValidToDate}{hasIsolationRequest, select, true {, og verði gert að sæta einangrun á meðan á gæsluvarðhaldi stendur} other {}}.',
    },
    caseFacts: {
      heading: 'Greinargerð um málsatvik',
      tooltip: 'Málsatvik, hvernig meðferð þessa máls hófst, skal skrá hér ásamt framburðum vitna og sakborninga ef til eru. Einnig er gott að taka fram stöðu rannsóknar og næstu skref.',
      label: 'Málsatvik',
      placeholder: 'Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?',
    },
    legalArguments: {
      heading: 'Greinargerð um lagarök',
      tooltip: 'Lagarök og lagaákvæði sem eiga við brotið og kröfuna skal taka fram hér.',
      label: 'Lagarök',
      placeholder: 'Hver eru lagarökin fyrir kröfunni?',
    },
  },
}
