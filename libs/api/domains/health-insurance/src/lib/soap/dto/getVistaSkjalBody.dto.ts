export interface GetVistaSkjalBody {
    sjukratryggingumsokn: Sjukratryggingumsokn
}

interface Sjukratryggingumsokn {
    // $: { // params xml tag
    //     [key: string]: string
    // },
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

interface Fylgiskjol {
    fylgiskjal: Fylgiskjal[]
}

interface Fylgiskjal {
    heiti: string
    innihald: string
}
