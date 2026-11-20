// How long an application can wait for the vehicle to return before it is
// pruned. The law sets no limit on how long a vehicle can stay abroad, so this
// is set generously to 5 years.
export const MAX_DAYS_ABROAD = 5 * 365

// How many days back in time the departure and the arrival can be registered.
// Neither can be registered ahead of time.
export const MAX_DAYS_BACK = 3

export const PROOF_OF_TRAVEL_FILE_TYPES = '.pdf, .doc, .docx, .jpg, .jpeg, .png'

export const PROOF_OF_TRAVEL_MAX_FILES = 5

// Skatturinn accepts requests up to 50 MB, leave room for the trip fields and
// multipart overhead
export const PROOF_OF_TRAVEL_MAX_TOTAL_SIZE = 45 * 1000 * 1000
