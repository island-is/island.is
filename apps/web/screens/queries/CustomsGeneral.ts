import gql from 'graphql-tag'

export const GET_CUSTOMS_GENERAL_ABENDI = gql`
  query CustomsGeneralAbendi($input: CustomsGeneralInput!) {
    customsGeneralAbendi(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_BONN = gql`
  query CustomsGeneralBonn($input: CustomsGeneralInput!) {
    customsGeneralBonn(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_GJOLD = gql`
  query CustomsGeneralGjold($input: CustomsGeneralInput!) {
    customsGeneralGjold(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_LEYFI = gql`
  query CustomsGeneralLeyfi($input: CustomsGeneralInput!) {
    customsGeneralLeyfi(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_TOLLAR = gql`
  query CustomsGeneralTollar($input: CustomsGeneralInput!) {
    customsGeneralTollar(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_UNDANTHAGUR = gql`
  query CustomsGeneralUndanthagur($input: CustomsGeneralInput!) {
    customsGeneralUndanthagur(input: $input) {
      code
      name
      description
      lagaGrein
      validFrom
      validTo
      system
    }
  }
`

export const GET_CUSTOMS_GENERAL_AFHENDINGARSKILMALAR = gql`
  query CustomsGeneralAfhendingarskilmalar($input: CustomsGeneralInput!) {
    customsGeneralAfhendingarskilmalar(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_FLUTNINGSMATI = gql`
  query CustomsGeneralFlutningsmati($input: CustomsGeneralInput!) {
    customsGeneralFlutningsmati(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_GEYMSLUSTADUR = gql`
  query CustomsGeneralGeymslustadur($input: CustomsGeneralDagsInput!) {
    customsGeneralGeymslustadur(input: $input) {
      kennitala
      code
      companyName
      location
    }
  }
`

export const GET_CUSTOMS_GENERAL_KOSTNADUR = gql`
  query CustomsGeneralKostnadur($input: CustomsGeneralInput!) {
    customsGeneralKostnadur(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_MAGNTALA = gql`
  query CustomsGeneralMagntala($input: CustomsGeneralInput!) {
    customsGeneralMagntala(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_MARKADSSVAEDI = gql`
  query CustomsGeneralMarkadssvaedi($input: CustomsGeneralInput!) {
    customsGeneralMarkadssvaedi(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_TEGUND_AFGREIDSLU = gql`
  query CustomsGeneralTegundAfgreidslu($input: CustomsGeneralInput!) {
    customsGeneralTegundAfgreidslu(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_TEGUND_VIDSKIPTA = gql`
  query CustomsGeneralTegundVidskipta($input: CustomsGeneralInput!) {
    customsGeneralTegundVidskipta(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_TOLLMEDFERD = gql`
  query CustomsGeneralTollmedferd($input: CustomsGeneralInput!) {
    customsGeneralTollmedferd(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_UMBUDIR = gql`
  query CustomsGeneralUmbudir($input: CustomsGeneralInput!) {
    customsGeneralUmbudir(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_UPPRUNI = gql`
  query CustomsGeneralUppruni($input: CustomsGeneralDagsInput!) {
    customsGeneralUppruni(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_VALYKILL = gql`
  query CustomsGeneralValykill($input: CustomsGeneralInput!) {
    customsGeneralValykill(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_VIDBOTARSKJOL = gql`
  query CustomsGeneralVidbotarskjol($input: CustomsGeneralInput!) {
    customsGeneralVidbotarskjol(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_VILLUR = gql`
  query CustomsGeneralVillur($input: CustomsGeneralInput!) {
    customsGeneralVillur(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_TOLLGENGI = gql`
  query CustomsGeneralTollgengi($input: CustomsGeneralInput!) {
    customsGeneralTollgengi(input: $input) {
      code
      name
      rate
    }
  }
`

export const GET_CUSTOMS_GENERAL_LAND_MYNT = gql`
  query CustomsGeneralLandMynt($input: CustomsGeneralDagsInput!) {
    customsGeneralLandMynt(input: $input) {
      countryCode
      countryName
      countryValidFrom
      countryValidTo
      currencyCode
      currencyName
      currencyValidFrom
      currencyValidTo
    }
  }
`

export const GET_CUSTOMS_GENERAL_TOLLSKRAR_LYKLAR = gql`
  query CustomsGeneralTollskrarLyklar($input: CustomsGeneralInput!) {
    customsGeneralTollskrarLyklar(input: $input) {
      version
      description
      periodFrom
      periodTo
      jsonUrl
      textUrl
    }
  }
`

export const GET_CUSTOMS_GENERAL_URVINNSLUGJOLD = gql`
  query CustomsGeneralUrvinnslugjold(
    $input: CustomsGeneralUrvinnslugjoldInput!
  ) {
    customsGeneralUrvinnslugjold(input: $input) {
      tariffNumber
      plRatio
      ppRatio
      validFrom
      validTo
    }
  }
`

export const GET_CUSTOMS_GENERAL_AKVORDUNARSTADIR = gql`
  query CustomsGeneralAkvordunarstadir {
    customsGeneralAkvordunarstadir {
      countryCode
      location
      locationName
    }
  }
`
