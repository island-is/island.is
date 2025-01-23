// Creates an array of roughly equal shares that sums up to the total
// For example:
//  10/3  => [4, 3, 3]
//  100/6 => [16, 16, 17, 17, 17, 17]
export const integerSplit = (total: number, parts: number): number[] => {
  if (parts <= 0) {
    return []
  }

  // Get share and fraction, f.x. 10/3 => share: 3, fraction: 0.333333
  let share = total / parts
  const shareFraction = share - Math.floor(share)

  // Choose which way to round based on the fraction to reduce
  // how many operations are needed
  //  F.x: adjusts 9=>10 one time instead of 10=>9 ten times for 100/11
  const roundingFunction = shareFraction >= 0.5 ? Math.ceil : Math.floor
  share = roundingFunction(share)
  const adjuster = shareFraction >= 0.5 ? -1 : 1

  // Create a dumb array and keep an account of it's sum
  // F.x: 10/3 results here in [3, 3, 3] with sum 9
  let sum = 0
  const result = Array.from({ length: parts }, () => {
    sum += share
    return share
  })

  // Iterate over the array with the adjuster until the sum matches
  // F.x 10/3 goes from [3, 3, 3] to [4, 3, 3] in one step with adjuster  1
  // ~~~  8/3 goes from [3, 3, 3] to [2, 3, 3] in one step with adjuster -1
  let iterator = 0
  while (sum != total) {
    result[iterator] += adjuster
    sum += adjuster
    iterator += 1
  }

  return result
}
