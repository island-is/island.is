import { HealthDirectoratePrescriptionRenewalBlockedReason } from '@island.is/api/schema'
import { FormatMessage } from '@island.is/localization'
import { messages } from '../lib/messages'

export const mapBlockedStatus = (
  reason: string,
  formatMessage: FormatMessage,
): { status: string; description: string } => {
  switch (reason) {
    case HealthDirectoratePrescriptionRenewalBlockedReason.IsRegiment:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(messages.prescriptionBlockedIsRegiment),
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.NoMedCard:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(messages.prescriptionBlockedNoMedCard),
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.NoHealthClinic:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(messages.prescriptionBlockedNoHealthClinic),
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.NotFullyDispensed:
      return {
        status: formatMessage(messages.valid),
        description: formatMessage(
          messages.prescriptionBlockedNotFullyDispensed,
        ),
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.PendingRequest:
      return {
        status: formatMessage(messages.medicineIsProcessedCertificate),
        description: formatMessage(messages.prescriptionBlockedPendingRequest),
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.RejectedRequest:
      return {
        status: formatMessage(messages.vaccineDeclined),
        description: formatMessage(messages.prescriptionBlockedRejectedRequest),
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.DismissedRequest:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(
          messages.prescriptionBlockedDismissedRequest,
        ),
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.AlreadyRequested:
      return {
        status: formatMessage(messages.medicineIsProcessedCertificate),
        description: formatMessage(
          messages.prescriptionBlockedAlreadyRequested,
        ),
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.MoreRecentPrescriptionExists:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(
          messages.prescriptionBlockedMoreRecentExists,
        ),
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.Unknown:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(messages.prescriptionBlockedOther),
      }
    default:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(messages.prescriptionBlockedOther),
      }
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
