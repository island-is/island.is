export const getAge = (ssn: string): number => {
  const today = new Date()

  const birthCentury = ssn.substring(9, 10) // can be 8, 9 or 0
  const birthDay = parseInt(ssn.substring(0, 2))
  const birthMonth = parseInt(ssn.substring(2, 4))
  const birthYear = parseInt(
    (birthCentury != '0' ? '1' : '2') + birthCentury + ssn.substring(4, 6),
  )
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay)

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--
  }
  return age
}
