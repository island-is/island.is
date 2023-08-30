import { defineMessages } from 'react-intl'

export const applicant = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.rpr.application:applicant.general.sectionTitle',
      defaultMessage: 'Umsækjendur',
      description: 'Applicant section title',
    },
  }),
  labels: {
    pickApplicant: defineMessages({
      subSectionTitle: {
        id:
          'doi.rpr.application:applicant.labels.pickApplicant.subSectionTitle',
        defaultMessage: 'Fyrir hvern á að sækja um?',
        description: 'Pick applicant sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:applicant.labels.pickApplicant.pageTitle',
        defaultMessage: 'Umsækjendur',
        description: 'Pick applicant page title',
      },
      title: {
        id: 'doi.rpr.application:applicant.labels.pickApplicant.title',
        defaultMessage: 'Fyrir hvern á að sækja um?',
        description: 'Pick applicant sub section title',
      },
      description: {
        id: 'doi.rpr.application:applicant.labels.pickApplicant.description',
        defaultMessage:
          'Einungis er hægt að endurnýja dvalarleyfi á sömu forsendum og síðast. Ef forsendur hafa breyst þarf að sækja um annars konar dvalarleyfi. ',
        description: 'Pick applicant description',
      },
      warningTitle: {
        id: 'doi.rpr.application:applicant.labels.pickApplicant.warningTitle',
        defaultMessage: 'Til athugunar!',
        description: 'Pick applicant sub section warning title',
      },
      warningMessage: {
        id: 'doi.rpr.application:applicant.labels.pickApplicant.warningMessage',
        defaultMessage:
          'Aðilinn sem rétturinn er dreginn af þarf að vera með dvalarleyfi í gildi eða með umsókn í vinnslu hjá Útlendingastofnun.',
        description: 'Pick applicant sub section warning message',
      },
      warningLinkMessage: {
        id:
          'doi.rpr.application:applicant.labels.pickApplicant.warningLinkMessage',
        defaultMessage:
          'Ef eftirfarandi upplýsingar eru ekki réttar þá þarf að breyta þeim hjá Útlendingastofnun og koma svo aftur til að klára umsóknina.',
        description: 'Pick applicant sub section warning link message',
      },
      warningLinkUrl: {
        id: 'doi.rpr.application:applicant.labels.pickApplicant.warningLinkUrl',
        defaultMessage: 'https://island.is/s/utlendingastofnun/',
        description: 'Pick applicant sub section warning link url',
      },
      infoTitle: {
        id: 'doi.rpr.application:applicant.labels.pickApplicant.infoTitle',
        defaultMessage: 'Upplýsingar',
        description: 'Pick applicant sub section info title',
      },
      infoMessage: {
        id: 'doi.rpr.application:applicant.labels.pickApplicant.infoMessage',
        defaultMessage:
          'Ef foreldrar fara sameiginlega með forsjá barns þarf að skila inn undirrituðu samþykki hins forsjárforeldrisins til Útlendingastofnunar.',
        description: 'Pick applicant sub section info message',
      },
      infoLinkMessage: {
        id:
          'doi.rpr.application:applicant.labels.pickApplicant.infoLinkMessage',
        defaultMessage: 'Sjá eyðublöð á vefsíðu Útlendingastofnunar.',
        description: 'Pick applicant sub section info link message',
      },
      infoLinkUrl: {
        id: 'doi.rpr.application:applicant.labels.pickApplicant.infoLinkUrl',
        defaultMessage: 'https://island.is/s/utlendingastofnun/',
        description: 'Pick applicant sub section info link url',
      },
      validTo: {
        id: 'doi.rpr.application:applicant.labels.pickApplicant.validTo',
        defaultMessage: `Gilt til: {date}`,
        description: 'Pick applicant checkbox tag: valid to',
      },
      checkboxSubLabel: {
        id:
          'doi.rpr.application:applicant.labels.pickApplicant.checkboxSubLabel',
        defaultMessage: 'Hinn forsjáraðilinn:',
        description:
          'Pick applicant checkbox sublabel: displayed below a childs name',
      },
    }),
    permanent: defineMessages({
      subSectionTitle: {
        id: 'doi.rpr.application:applicant.labels.permanent.subSectionTitle',
        defaultMessage: 'Réttindi - ótímabundið',
        description: 'Permanent sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:applicant.labels.permanent.pageTitle',
        defaultMessage: 'Réttindi - ótímabundið dvalarleyfi',
        description: 'Permanent page title',
      },
      description: {
        id: 'doi.rpr.application:applicant.labels.permanent.description',
        defaultMessage:
          'Eftirfarandi aðilar/aðili hafa dvalið nógu lengi á Íslandi til þess að geta átt rétt á ótímabundnu dvalarleyfi. Sjá nánar önnur skilyrði á <a href="/">heimasíðu Útlendingastofnunar</a>.  Ef þú vilt geturðu smellt á linkinn hér að neðan til að hefja nýja umsókn fyrir ótímabundið dvalarleyfi (þá fellur þessi umsókn út gildi). Athugið að aðilinn sem réttur er dreginn af þarf að vera komin með ótímabundið eða hafa sótt um það eða vera EES ríkisborgari eða íslenskur ríkisborgari.',
        description: 'Permanent description',
      },
      title: {
        id: 'doi.rpr.application:applicant.labels.permanent.title',
        defaultMessage: 'Test',
        description: 'Permanent sub section title',
      },
      messageWithLinkButtonTitle: {
        id:
          'doi.rpr.application:applicant.labels.permanent.messageWithLinkButtonTitle',
        defaultMessage: 'Opna nýja umsókn',
        description: 'Title for new application button',
      },
      messageWithLinkTitle: {
        id:
          'doi.rpr.application:applicant.labels.permanent.messageWithLinkTitle',
        defaultMessage: 'Umsókn um ótímabundið dvalarleyfi',
        description: 'Message with link title',
      },
      messageWithLinkUrl: {
        id: 'doi.rpr.application:applicant.labels.permanent.messageWithLinkUrl',
        defaultMessage: '/',
        description: 'Message with link url',
      },
    }),
  },
}
