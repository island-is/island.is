export function hasReachedAge(
  nationalId: string,
  electionDate: Date,
  minimumAge: number,
): boolean {
  const year =
    (nationalId.substring(9, 10) === '0' ? 20 : 19) + nationalId.substring(4, 6)
  const electionYear = electionDate.getFullYear()
  const age = electionYear - Number(year)

  if (age > minimumAge) return true

  if (age === minimumAge) {
    const birthMonth = Number(nationalId.substring(2, 4))
    const electionMonth = electionDate.getMonth() + 1

    if (birthMonth > electionMonth) return true

    if (birthMonth === electionMonth) {
      const birthDay = Number(nationalId.substring(0, 2))
      const electionDay = electionDate.getDate()

      if (birthDay >= electionDay) return true
    }
  }

  return false
}
