// Creates an array of calculated shares that sum up to the total
// F.x:
//  total: 100, percentages: [33.3, 33.3, 33.4] => [33, 33, 34]
//
// Requirements: Percentages should sum up to 100 exactly.

// WARNING:
//  This method uses the Hamilton method of apportionment
//  which renders it susceptible to the Alabama Paradox.
//  Do not use this method of apportionment elsewhere unless you are certain
//  that the Alabama Paradox is inconsequential to your use case.
//  See: https://en.wikipedia.org/wiki/Apportionment_paradox
export const integerPercentageSplit = (
  total: number,
  percentages: number[],
): number[] => {
  const negativeTotal = total < 0
  total = Math.abs(total)

  const percentageSum = percentages.reduceRight((p, c) => p + c)
  if (!isEqualWithTolerance(percentageSum, 100)) {
    throw new Error('Percentages must add up to 100 exactly')
  }

  if (percentages.some((p) => p < 0)) {
    throw new Error('A percentage may not be negative')
  }

  const shares = percentages.map((p) => Math.floor((p / 100) * total))
  let sum = shares.reduceRight((p, c) => p + c)

  // The value of accumulated errors should not exceed the number of elements.
  // Therefore we iterate in a specific order.
  // We correct **first** the values that were floored the most.

  // For example, flooring the values [1.8, 1.6, 1.9, 1.7] goes to [1, 1, 1, 1].
  // The real total is 7 but the floored total is 4. We need to add a value of 1 to 3 shares
  // in order to match that same total.
  // So a fair result is [2, 1, 2, 2] from an iterationOrder = [1, 3, 0, 2].
  const iterationOrder = percentages
    .map((p) => (p / 100) * total - Math.floor((p / 100) * total))
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value)
    .map((e) => e.index)

  let iterator = 0
  while (sum < total) {
    shares[iterationOrder[iterator]] += 1
    sum += 1

    iterator += 1
    iterator = iterator % iterationOrder.length
  }
  if (negativeTotal) {
    return shares.map((e) => e * -1)
  }
  return shares
}

// Returns true if an array sums to a target number,
// includes a tolerance to account for floating point errors
// Example:
//   isEqualWithTolerance(99.999999, 100, 1e-6) === true
export const isEqualWithTolerance = (
  number: number,
  target: number,
  tolerance = 10e-10,
) => {
  return number === target || Math.abs(target - number) <= tolerance
}
