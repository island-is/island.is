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
  UnakFerillLocale,
  LbhiFerillLocale,
  BifrostFerillLocale,
  HolarFerillLocale,
  HIFerillLocale,
  LHIApi,
  LHIFerillLocale,
  LHILocale,
  BifrostFileType,
  UnakFileType,
  HIFileType,
  HolarFileType,
  LHIFileType,
  LbhiFileType,
  BifrostTranscriptLocale,
  HITranscriptLocale,
  HolarTranscriptLocale,
  LHITranscriptLocale,
  LbhiTranscriptLocale,
  UnakTranscriptLocale,
} from '../clients'

export interface UniversityDto {
  api: LbhiApi | UnakApi | HolarApi | BifrostApi | HIApi | LHIApi
  fileTypeEnum:
    | typeof LbhiFileType
    | typeof UnakFileType
    | typeof HolarFileType
    | typeof BifrostFileType
    | typeof HIFileType
    | typeof LHIFileType
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
