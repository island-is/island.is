// The payment structure is as follows:
// 1. If the current appraisal is less than 25 million, the payment is 6.000kr
// 2. If the current appraisal is between 25 million and 500 million, the payment is 0.03% of the current appraisal
// 3. If the current appraisal is greater than 500 million, the payment is 0.01% of the current appraisal
export const paymentForAppraisal = (currentAppraisal: number) => {
  if (currentAppraisal < 25000000) {
    return 6000
  }

  if (currentAppraisal > 500000000) {
    return currentAppraisal * 0.0001
  }

  return currentAppraisal * 0.0003
}
