import Statement from '@island.is/judicial-system-web/src/routes/Shared/AppealToCourtOfAppeals/Statement'

/**
 * Defender greinargerð for a verdict appeal (áfrýjun). Reuses the shared
 * Statement upload/send flow with verdict-appeal file categories and the
 * case's verdictAppealCase as the event-log target.
 */
const VerdictAppealStatement = () => <Statement isVerdictAppeal />

export default VerdictAppealStatement
