import kennitala from 'kennitala'
import startOfDay from 'date-fns/startOfDay'

export const isUnderXAge = (age: number, nationalId: string) => {
  const birthDate = kennitala.info(nationalId).birthday
  const now = startOfDay(new Date())
  const eighteen = startOfDay(
    new Date(
      birthDate.getFullYear() + age,
      birthDate.getMonth(),
      birthDate.getDate(),
    ),
  )

  const timeUntilAge = eighteen.getTime() - now.getTime()

  return timeUntilAge > 0
}
