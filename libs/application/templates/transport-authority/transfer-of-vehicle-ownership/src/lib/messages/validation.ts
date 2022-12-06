import { defineMessages } from 'react-intl'

export const validation = {
  application: defineMessages({
    '0': {
      id: 'ta.tvo.application:validation.application.0',
      defaultMessage: 'Það kom upp villa við að sannreyna gögn fyrir umsókn',
      description: 'Default error message',
    },
    '1': {
      id: 'ta.tvo.application:validation.application.1',
      defaultMessage: 'Kennitala kaupanda ekki til í Nöfnum',
      description: 'Message for error no 1',
    },
    '2': {
      id: 'ta.tvo.application:validation.application.2',
      defaultMessage:
        'Kaupdagur er á undan síðasta kaupdegi, breyta þarf kaupdegi áður en eigendaskipti fara fram.',
      description: 'Message for error no 2',
    },
    '3': {
      id: 'ta.tvo.application:validation.application.3',
      defaultMessage: 'Afgreiðsludagur er á undan kaupdegi',
      description: 'Message for error no 3',
    },
    '4': {
      id: 'ta.tvo.application:validation.application.4',
      defaultMessage: 'Afgreiðsludagur er fram í tímann',
      description: 'Message for error no 4',
    },
    '5': {
      id: 'ta.tvo.application:validation.application.5',
      defaultMessage: 'Kaupdagur er á undan forskráningardegi',
      description: 'Message for error no 5',
    },
    '6': {
      id: 'ta.tvo.application:validation.application.6',
      defaultMessage: '"Kennitala seljanda er fyllt út en engar villur skráðar',
      description: 'Message for error no 6',
    },
    '21': {
      id: 'ta.tvo.application:validation.application.21',
      defaultMessage: 'Kaupdagur verður að vera útfylltur',
      description: 'Message for error no 21',
    },
    '22': {
      id: 'ta.tvo.application:validation.application.22',
      defaultMessage: 'Afgreiðsludagur verður að vera útfylltur',
      description: 'Message for error no 22',
    },
    '23': {
      id: 'ta.tvo.application:validation.application.23',
      defaultMessage: 'Skráningardagur verður að vera útfylltur',
      description: 'Message for error no 23',
    },
    '24': {
      id: 'ta.tvo.application:validation.application.24',
      defaultMessage: 'Kennitala verður að vera 10 stafir að lengd',
      description: 'Message for error no 24',
    },
    '29': {
      id: 'ta.tvo.application:validation.application.29',
      defaultMessage: 'Kennitala eiganda verður að vera útfyllt.',
      description: 'Message for error no 29',
    },
    '30': {
      id: 'ta.tvo.application:validation.application.30',
      defaultMessage: 'Tryggingarfélag verður að vera útfyllt.',
      description: 'Message for error no 30',
    },
    '31': {
      id: 'ta.tvo.application:validation.application.31',
      defaultMessage: 'Tryggingarfélag er ekki rétt slegið inn',
      description: 'Message for error no 31',
    },
    '34': {
      id: 'ta.tvo.application:validation.application.34',
      defaultMessage: 'Tegund tilkynnanda skal vera útfyllt.',
      description: 'Message for error no 34',
    },
    '43': {
      id: 'ta.tvo.application:validation.application.43',
      defaultMessage: 'Ekki má skrá eigendakipti á ökutæki sem afskráð - týnt.',
      description: 'Message for error no 43',
    },
    '44': {
      id: 'ta.tvo.application:validation.application.44',
      defaultMessage: '"Nauðsynlegt er að tilgreina söluandvirði ökutækis',
      description: 'Message for error no 44',
    },
    '45': {
      id: 'ta.tvo.application:validation.application.45',
      defaultMessage:
        'Ökutækið er ekki orðið 25 ára og því má ekki skrá það sem fornbifreið',
      description: 'Message for error no 45',
    },
    '46': {
      id: 'ta.tvo.application:validation.application.46',
      defaultMessage:
        'Athugið: Ökutækið er ekki með nýskráningu. Gera þarf umráðamannabreytingu.',
      description: 'Message for error no 46',
    },
    '47': {
      id: 'ta.tvo.application:validation.application.47',
      defaultMessage:
        'Ekki má hafa eigandaskipti á ökutæki sem hefur verið skráð til úrvinnslu',
      description: 'Message for error no 47',
    },
    '48': {
      id: 'ta.tvo.application:validation.application.48',
      defaultMessage:
        'Ekki má hafa eigandaskipti á ökutæki sem er í notkunarflokki 011 (Ökut. m. ferðaþjónustul)',
      description: 'Message for error no 48',
    },
    '49': {
      id: 'ta.tvo.application:validation.application.49',
      defaultMessage:
        'Ekki má hafa eigandaskipt á ökutæki sem er í notkunarflokki 012 (Ökutækjal./ferðaþj.leyfi)',
      description: 'Message for error no 49',
    },
    '50': {
      id: 'ta.tvo.application:validation.application.50',
      defaultMessage:
        'Ekki má hafa eigandaskipti á ökutæki sem er í notkunarflokki 013 (VSK / ferðaþj.leyfi)',
      description: 'Message for error no 50',
    },
    '51': {
      id: 'ta.tvo.application:validation.application.51',
      defaultMessage: 'Seljandi er ekki skráður eigandi eða meðeigandi',
      description: 'Message for error no 51',
    },
    '54': {
      id: 'ta.tvo.application:validation.application.54',
      defaultMessage:
        'Ökutæki þarf að hafa farið í löglega skoðun á síðustu 12 mánuðum',
      description: 'Message for error no 54',
    },
    '55': {
      id: 'ta.tvo.application:validation.application.55',
      defaultMessage: 'Ökutæki finnst ekki',
      description: 'Message for error no 55',
    },
    '57': {
      id: 'ta.tvo.application:validation.application.57',
      defaultMessage:
        'Til eru gölluð eigendaskipti fyrir ökutækið (ekki ef búið er að hafna þeim)',
      description: 'Message for error no 57',
    },
    '58': {
      id: 'ta.tvo.application:validation.application.58',
      defaultMessage:
        'Eigendaskiptaálestur hefur ekki farið fram innan sjö daga (Skeyti)',
      description: 'Message for error no 58',
    },
    '59': {
      id: 'ta.tvo.application:validation.application.59',
      defaultMessage:
        'Samgöngustofa er ekki með umboð fyrir tryggingafélagið og eigandi er ekki skráður með tryggingafærslu fyrir ökutækið',
      description: 'Message for error no 59',
    },
    '61': {
      id: 'ta.tvo.application:validation.application.61',
      defaultMessage: 'Kaupandi er undir lögaldri',
      description: 'Message for error no 61',
    },
    '62': {
      id: 'ta.tvo.application:validation.application.62',
      defaultMessage: 'Seljandi er undir lögaldri',
      description: 'Message for error no 62',
    },
    '63': {
      id: 'ta.tvo.application:validation.application.63',
      defaultMessage:
        'Verið er að skrá eigandaskipti á sendiráðsökutæki. Athugið að fyrst þarf að skipta um skráningarmerki.',
      description: 'Message for error no 63',
    },
    '64': {
      id: 'ta.tvo.application:validation.application.64',
      defaultMessage: 'Ökutæki er skráð til neyðaraksturs',
      description: 'Message for error no 64',
    },
    '65': {
      id: 'ta.tvo.application:validation.application.65',
      defaultMessage: 'Tegund stöðvar skal vera útfyllt.',
      description: 'Message for error no 65',
    },
    '66': {
      id: 'ta.tvo.application:validation.application.66',
      defaultMessage:
        'Skráður er rétthafi að fornmerkjum og ef merkið á að fylgja bílnum þarf rétthafinn að framvísa því til kaupanda.',
      description: 'Message for error no 66',
    },
    '67': {
      id: 'ta.tvo.application:validation.application.67',
      defaultMessage:
        'Eigendaskiptaálestur fór fram í dag. Athugið hvort gjöld hafi verið lögð á.',
      description: 'Message for error no 67',
    },
    '68': {
      id: 'ta.tvo.application:validation.application.68',
      defaultMessage: 'Ökutæki þarf að fara í eigendaskiptaálestur',
      description: 'Message for error no 68',
    },
    '69': {
      id: 'ta.tvo.application:validation.application.69',
      defaultMessage: 'Ökutækið þarf að fara í eigendaskiptaálestur',
      description: 'Message for error no 69',
    },
    '70': {
      id: 'ta.tvo.application:validation.application.70',
      defaultMessage:
        'Ekki má hafa eigandaskipti á ökutæki sem er í notkunarflokki 011 (Ökut. m. ferðaþjónustul)',
      description: 'Message for error no 70',
    },
    '71': {
      id: 'ta.tvo.application:validation.application.71',
      defaultMessage:
        'Ekki má hafa eigandaskipt á ökutæki sem er í notkunarflokki 012 (Ökutækjal./ferðaþj.leyfi)',
      description: 'Message for error no 71',
    },
    '72': {
      id: 'ta.tvo.application:validation.application.72',
      defaultMessage:
        'Ekki má hafa eigandaskipti á ökutæki sem er í notkunarflokki 013 (VSK / ferðaþj.leyfi)',
      description: 'Message for error no 72',
    },
    '73': {
      id: 'ta.tvo.application:validation.application.73',
      defaultMessage:
        'Það eru til rafræn eigandaskipti sem ekki er búið að klára. Hafna þarf rafrænu eigandaskiptunum samhliða.',
      description: 'Message for error no 73',
    },
    '74': {
      id: 'ta.tvo.application:validation.application.74',
      defaultMessage:
        'Ekki má hafa eigandaskipti á ökutæki sem er í notkunarflokki 012 (Ökutækjal./ ferðaþj.leyfi)',
      description: 'Message for error no 74',
    },
    '76': {
      id: 'ta.tvo.application:validation.application.76',
      defaultMessage:
        'Ekki má hafa eigandaskipti á ökutæki sem er í notkunarflokki 003 (Sendiráðsökutæki)',
      description: 'Message for error no 76',
    },
    '78': {
      id: 'ta.tvo.application:validation.application.78',
      defaultMessage:
        'Ekki er hægt að framkvæma eigandaskipti af ökutæki í flokknum eigandaleiga nema ökutækið hafi farið í aðalskoðun á almanaksárinu.',
      description: 'Message for error no 78',
    },
    '81': {
      id: 'ta.tvo.application:validation.application.81',
      defaultMessage:
        'Ökutæki er að fara í víðari skoðunartíðni og hefur ekki farið í skráningarskoðun, aðalskoðun, fulltrúaskoðun eða samanburðarskoðun innan almanksárs.',
      description: 'Message for error no 81',
    },
  }),
}
