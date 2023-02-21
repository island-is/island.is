export enum IndictmentCountOffense {
  DRIVING_WITHOUT_LICENCE = 'DRIVING_WITHOUT_LICENCE',
  DRUNK_DRIVING = 'DRUNK_DRIVING',
  ILLEGAL_DRUGS_DRIVING = 'ILLEGAL_DRUGS_DRIVING',
  PRESCRIPTION_DRUGS_DRIVING = 'PRESCRIPTION_DRUGS_DRIVING',
}

export enum Substance {
  ALCOHOL = 'ALCOHOL',
}

export type SubstanceMap = {
  [key in IndictmentCountOffense]?: { [key in Substance]?: string }
}
