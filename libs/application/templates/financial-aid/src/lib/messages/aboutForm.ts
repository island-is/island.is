import { defineMessages } from 'react-intl'

export const aboutForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.aboutForm.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'About form section title',
    },
    pageTitle: {
      id: 'fa.application:section.aboutForm.general.pageTitle',
      defaultMessage: 'Upplýsingar varðandi umsóknina',
      description: 'About form page title',
    },
    description: {
      id: 'fa.application:section.aboutForm.general.description',
      defaultMessage:
        'Þú ert að sækja um fjárhagsaðstoð hjá þínu sveitarfélagi fyrir {currentMonth} mánuð. Áður en þú heldur áfram er gott að hafa eftirfarandi í huga:',
      description: 'About form page description',
    },
  }),
  bulletList: defineMessages({
    content: {
      id: 'fa.application:section.aboutForm.bulletList.content#markdown',
      defaultMessage:
        '* Til að eiga rétt á fjárhagsaðstoð þurfa tekjur og eignir þínar að vera undir ákveðnum viðmiðunarmörkum.\n* Fjárhagsaðstoð getur verið í formi láns eða styrks. \n* Áður en þú sækir um fjárhagsaðstoð skaltu athuga hvort þú eigir rétt á annarskonar aðstoð. Dæmi um önnur úrræði eru [almannatryggingar](https://www.stjornarradid.is/verkefni/almannatryggingar-og-lifeyrir/almannatryggingar/), [atvinnuleysisbætur](https://vinnumalastofnun.is/umsoknir/umsokn-um-atvinnuleysisbaetur), [lífeyrissjóðir](https://www.lifeyrismal.is/is/sjodirnir), [Sjúkratryggingar Íslands](https://www.sjukra.is/) og sjúkrasjóðir stéttarfélaga. \n* Ef þú ert í lánshæfu námi gætir þú átt rétt á námsláni hjá [Menntasjóði námsmanna](https://menntasjodur.is/).',
      description: 'About form Bullet list content',
    },
  }),
  goToApplication: defineMessages({
    button: {
      id: 'fa.application:section.aboutForm.goToApplication.button',
      defaultMessage: 'Fara í umsókn',
      description: 'Go to application button text',
    },
  }),
}
