interface SalaryBreakdown {
  'b:_Tharaf_gr_sereignarsparnadur': number
  'b:_ar': number
  'b:_bifreidahlunnindi': undefined | string
  'b:_dagpeningar': number
  'b:_dagsetningSundurlidunar': string
  'b:_faersludagsetning': string
  'b:_fradr_gr_lifeyrissj': number
  'b:_grunnlaun': number
  'b:_heildarlaun': number
  'b:_isat': string
  'b:_kennitalaLaunagreidanda': number
  'b:_okutaekjastyrkur': number
  'b:_personuafslattur': number
  'b:_personuafslattur_maka': number
  'b:_stadgreidsla': number
  'b:_starfshlutfall': number
  'b:_timabil': number
}

export interface DirectTaxPaymentResponse {
  's:Envelope': {
    's:Body': {
      SaekjaSundurlidanirResponse: {
        SaekjaSundurlidanirResult: {
          'b:_abendingar': undefined | string
          'b:_kennitalaLaunamanns': undefined | string
          'b:_kodiLaunagreidslna': undefined | number
          'b:_launagr_re': salary
          'b:_launagr_re_Maki': salary
          'b:_launasundurlidanir':
            | undefined
            | {
                'b:Launasundurlidun': SalaryBreakdown[] | SalaryBreakdown
              }
          'b:_saekjaGognTokst': boolean
          'b:_timastimpill': undefined | string
          'b:_villubod': undefined | string
        }
      }
    }
  }
}

type salary = {
  'b:ReiknadEndurgjaldDetail':
    | undefined
    | {
        'b:_faersludagsetning': string
        'b:_flokkur': string
        'b:_isat': number
        'b:_manFraTil': string
        'b:_mottokudagsetning': string
        'b:_nrFaerslu': number
        'b:_reiknadEndurgjald': number
        'b:_reiknadEndurgjaldMaka': number
        'b:_stadgreidsla': number
        'b:_tekjuar': number
      }
}
