import { HealthDirectoratePrescriptionRenewalBlockedReason } from '@island.is/api/schema'
import { FormatMessage } from '@island.is/localization'
import { messages } from '../lib/messages'

export const mapBlockedStatus = (
  reason: string,
  formatMessage: FormatMessage,
): string => {
  switch (reason) {
    case HealthDirectoratePrescriptionRenewalBlockedReason.IsRegiment:
      return formatMessage(messages.prescriptionBlockedIsRegiment)
    case HealthDirectoratePrescriptionRenewalBlockedReason.NoMedCard:
      return formatMessage(messages.prescriptionBlockedNoMedCard)
    case HealthDirectoratePrescriptionRenewalBlockedReason.NoHealthClinic:
      return formatMessage(messages.prescriptionBlockedNoHealthClinic)
    case HealthDirectoratePrescriptionRenewalBlockedReason.NotFullyDispensed:
      return formatMessage(messages.prescriptionBlockedNotFullyDispensed)
    case HealthDirectoratePrescriptionRenewalBlockedReason.PendingRequest:
      return formatMessage(messages.prescriptionBlockedPendingRequest)
    case HealthDirectoratePrescriptionRenewalBlockedReason.RejectedRequest:
      return formatMessage(messages.prescriptionBlockedRejectedRequest)
    case HealthDirectoratePrescriptionRenewalBlockedReason.DismissedRequest:
      return formatMessage(messages.prescriptionBlockedDismissedRequest)
    case HealthDirectoratePrescriptionRenewalBlockedReason.AlreadyRequested:
      return formatMessage(messages.prescriptionBlockedAlreadyRequested)
    case HealthDirectoratePrescriptionRenewalBlockedReason.MoreRecentPrescriptionExists:
      return formatMessage(messages.prescriptionBlockedMoreRecentExists)
    case HealthDirectoratePrescriptionRenewalBlockedReason.Unknown:
      return formatMessage(messages.prescriptionBlockedOther)
    default:
      return formatMessage(messages.prescriptionBlockedOther)
  }
}

export const mapWeekday = (weekday: string, formatMessage: FormatMessage) => {
  switch (weekday) {
    case 'mánudagur':
      return formatMessage(messages.weekdayMondayAcc)
    case 'þriðjudagur':
      return formatMessage(messages.weekdayTuesdayAcc)
    case 'miðvikudagur':
      return formatMessage(messages.weekdayWednesdayAcc)
    case 'fimmtudagur':
      return formatMessage(messages.weekdayThursdayAcc)
    case 'föstudagur':
      return formatMessage(messages.weekdayFridayAcc)
    case 'laugardagur':
      return formatMessage(messages.weekdaySaturdayAcc)
    case 'sunnudagur':
      return formatMessage(messages.weekdaySundayAcc)
    default:
      return weekday
  }
}
