import { LbhiApi, UnakApi, HolarApi, BifrostApi, HIApi, UnakLocale, LbhiLocale, BifrostLocale, HolarLocale, HILocale, UnakTranscriptLocale, LbhiTranscriptLocale, BifrostTranscriptLocale, HolarTranscriptLocale, HITranscriptLocale, UnakFerillLocale, LbhiFerillLocale, BifrostFerillLocale, HolarFerillLocale, HIFerillLocale } from "../clients"

export interface UniversityDto {
  api: LbhiApi | UnakApi | HolarApi | BifrostApi | HIApi
  locales: {
    studentLocale:
      | typeof UnakLocale
      | typeof LbhiLocale
      | typeof BifrostLocale
      | typeof HolarLocale
      | typeof HILocale
    studentTranscriptLocale:
      | typeof UnakTranscriptLocale
      | typeof LbhiTranscriptLocale
      | typeof BifrostTranscriptLocale
      | typeof HolarTranscriptLocale
      | typeof HITranscriptLocale
    studentTrackLocale:
      | typeof UnakFerillLocale
      | typeof LbhiFerillLocale
      | typeof BifrostFerillLocale
      | typeof HolarFerillLocale
      | typeof HIFerillLocale
  }
