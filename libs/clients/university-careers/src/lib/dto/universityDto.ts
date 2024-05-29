import {
  LbhiApi,
  UnakApi,
  HolarApi,
  BifrostApi,
  HIApi,
  UnakLocale,
  LbhiLocale,
  BifrostLocale,
  HolarLocale,
  HILocale,
  UnakTranscriptLocale,
  LbhiTranscriptLocale,
  BifrostTranscriptLocale,
  HolarTranscriptLocale,
  HITranscriptLocale,
  UnakFerillLocale,
  LbhiFerillLocale,
  BifrostFerillLocale,
  HolarFerillLocale,
  HIFerillLocale,
  LHIApi,
  LHIFerillLocale,
  LHILocale,
  LHITranscriptLocale,
} from '../clients'

export interface UniversityDto {
  api: LbhiApi | UnakApi | HolarApi | BifrostApi | HIApi | LHIApi
  locales: {
    studentLocale:
      | typeof UnakLocale
      | typeof LbhiLocale
      | typeof BifrostLocale
      | typeof HolarLocale
      | typeof HILocale
      | typeof LHILocale
    studentTranscriptLocale:
      | typeof UnakTranscriptLocale
      | typeof LbhiTranscriptLocale
      | typeof BifrostTranscriptLocale
      | typeof HolarTranscriptLocale
      | typeof HITranscriptLocale
      | typeof LHITranscriptLocale
    studentTrackLocale:
      | typeof UnakFerillLocale
      | typeof LbhiFerillLocale
      | typeof BifrostFerillLocale
      | typeof HolarFerillLocale
      | typeof HIFerillLocale
      | typeof LHIFerillLocale
  }
}
