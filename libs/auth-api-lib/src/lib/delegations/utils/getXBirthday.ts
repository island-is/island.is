import kennitala from 'kennitala'
import startOfDay from 'date-fns/startOfDay'
import isBefore from 'date-fns/isBefore'

/* Gets the date when a person turns X age */
export const getXBirthday = (age: number, nationalId: string) => {
  const birthDate = kennitala.info(nationalId).birthday

  // The date when the person turns X age
  const xBirthday = startOfDay(
    new Date(
      birthDate.getFullYear() + age,
      birthDate.getMonth(),
      birthDate.getDate(),
    ),
  )

  // If a person hasn't already turned X age
  if (isBefore(new Date(), xBirthday)) {
    return xBirthday
  }

  return null
}
