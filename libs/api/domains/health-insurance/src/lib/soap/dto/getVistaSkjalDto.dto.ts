export interface GetVistaSkjalDtoType {
  VistaSkjalType: VistaSkjalType
}
interface VistaSkjalType {
  tokst: number
  villulysing?: string
  radnumer_si?: number
  skjalanumer_si?: number
  villulisti?: VilluListi[]
}
interface VilluListi {
  linunumer?: number
  villa?: number
  tegundvillu?: string
  villulysinginnri?: string
}
