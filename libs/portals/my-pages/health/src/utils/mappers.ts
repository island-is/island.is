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
  switch (weekday.toLowerCase()) {
    case 'monday':
      return formatMessage(messages.weekdayMondayAcc)
    case 'tuesday':
      return formatMessage(messages.weekdayTuesdayAcc)
    case 'wednesday':
      return formatMessage(messages.weekdayWednesdayAcc)
    case 'thursday':
      return formatMessage(messages.weekdayThursdayAcc)
    case 'friday':
      return formatMessage(messages.weekdayFridayAcc)
    case 'saturday':
      return formatMessage(messages.weekdaySaturdayAcc)
    case 'sunday':
      return formatMessage(messages.weekdaySundayAcc)
    default:
      return weekday
  }
}
