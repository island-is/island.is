describe('/domur/stadfesta/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/domur/stadfesta/test_id_stadfesting')
  })

  it('should display the ruling statement', () => {
    cy.contains(
      'Kærða, Batman Robinsson kt. 000000-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til miðvikudagsins 16. september 2020, kl. 19:50.',
    )
  })

  it('should display the ruling', () => {
    cy.contains(
      'Samkvæmt framangreindu og rannsóknargögnum málsins og með vísan til þess sem fram kemur í greinargerð sóknaraðila er fallist á það með lögreglustjóra að varnaraðili sé undir rökstuddum grun um saknæma aðild að háttsemi sem fangelsisrefsing er lögð við. Fyrir liggur að rannsókn málsins beinist að [..] óljóst er hversu margir aðilar kunni að tengjast. Telur dómurinn að fullnægt sé skilyrðum a-liðar 1. mgr. 95. gr. laga nr. 88/2008 um meðferð sakamála til þess að varnaraðila verði gert að sæta gæsluvarðhaldi. Þá þykja ekki efni til að marka gæsluvarðhaldi skemmri tíma en krafist er. Að virtum þeim rannsóknarhagsmunum sem málið varða samkvæmt framangreindu er fallist á að nauðsynlegt sé að varnaraðili sæti einangrun á meðan á gæsluvarðhaldsvistinni stendur, skv. 2. mgr. 98. gr., sbr. b-lið 99. gr. laga nr. 88/2008. Með vísan til þessa er fallist á kröfuna eins og nánar greinir í úrskurðarorði. Kristín Gunnarsdóttir héraðsdómari kveður upp úrskurðinn.',
    )
  })
})
