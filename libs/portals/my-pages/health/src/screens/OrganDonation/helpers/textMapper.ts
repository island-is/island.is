export const getOrganText = (
  isDonor: boolean,
  hasLimitations: boolean,
  texts: {
    iAmOrganDonorWithExceptionsText: string
    iAmOrganDonorText: string
    iAmNotOrganDonorText: string
    iAmOrganDonorWithExceptions: string
    iAmOrganDonor: string
    iAmNotOrganDonor: string
  },
  limitations: string[],
) => {
  const limitationText = hasLimitations
    ? texts.iAmOrganDonorWithExceptionsText + ' ' + limitations.join(', ')
    : texts.iAmOrganDonorText

  const cardText: string = isDonor ? limitationText : texts.iAmNotOrganDonorText

  const heading = isDonor
    ? hasLimitations
      ? texts.iAmOrganDonorWithExceptions
      : texts.iAmOrganDonor
    : texts.iAmNotOrganDonor

  return { cardText, heading }
}
