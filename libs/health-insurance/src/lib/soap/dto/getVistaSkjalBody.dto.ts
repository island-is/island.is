export interface GetVistaSkjalBody {
  sjukratryggingumsokn: Sjukratryggingumsokn
}

interface Sjukratryggingumsokn {
  einstaklingur: Einstaklingur
  numerumsoknar: string
  dagsumsoknar: string
  dagssidustubusetuthjodskra: string
  dagssidustubusetu: string
  stadaeinstaklings: string
  bornmedumsaekjanda: number
  fyrrautgafuland: string
  fyrrautgafulandkodi: string
  fyrriutgafustofnunlands: string
  tryggdurfyrralandi: number
  tryggingaretturfyrralandi: number
  vidbotarupplysingar: string
  fylgiskjol?: Fylgiskjol
}

interface Einstaklingur {
  kennitala: string
  erlendkennitala: string
  nafn: string
  heimili: string
  postfangstadur: string
  rikisfang: string
  rikisfangkodi: string
  simi: string
  netfang: string
}

export interface Fylgiskjol {
  fylgiskjal: Fylgiskjal[]
}

export interface Fylgiskjal {
  heiti: string
  innihald: string
}
