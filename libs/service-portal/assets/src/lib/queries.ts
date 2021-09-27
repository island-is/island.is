import { gql } from '@apollo/client'

export const GET_SINGLE_PROPERTY_QUERY = gql`
  query GetSingleRealEstateQuery($input: GetRealEstateInput!) {
    getRealEstateDetail(input: $input)
  }
`

export const GET_UNITS_OF_USE_QUERY = gql`
  query GetNotkunareiningar($input: GetPagingTypes!) {
    getNotkunareiningar(input: $input) {
      paging {
        page
        pageSize
        totalPages
        offset
        total
        hasPreviousPage
        hasNextPage
      }
      data {
        fasteignanumer
        notkunareininganumer
        merking
        notkun
        notkunBirting
        starfsemi
        lysing
        byggingarAr
        birtStaerd
        byggingararBirting
        lodarmat
        brunabotamat
        fasteignamat {
          gildandiFasteignamat
          fyrirhugadFasteignamat
          gildandiMannvirkjamat
          fyrirhugadMannvirkjamat
          gildandiLodarhlutamat
          fyrirhugadLodarhlutamat
          gildandiAr
          fyrirhugadAr
        }
        stadfang {
          stadfanganumer
          stadvisir
          stadgreinir
          postnumer
          sveitarfelag
          landeignarnumer
          birting
          birtingStutt
        }
      }
    }
  }
`

export const GET_PROPERTY_OWNERS_QUERY = gql`
  query GetThinglystirEigendurQuery($input: GetPagingTypes!) {
    getThinglystirEigendur(input: $input) {
      thinglystirEigendur {
        nafn
        kennitala
        eignarhlutfall
        kaupdagur
        heimildBirting
      }
      paging {
        page
        pageSize
        totalPages
        offset
        total
        hasPreviousPage
        hasNextPage
      }
    }
  }
`
