export type ValidationType = 'registrationNumber'

export const validate = (value: string, type: ValidationType) => {
  switch (type) {
    case 'registrationNumber':
      const regular = new RegExp(/^[A-Z]{1,2}(\s|\-){0,1}([A-Z]){1}\d{2}$/gi)
      const antique = new RegExp(/^[A-Z]{1}\s{0,1}\d{5}$/gi)
      return regular.test(value) || antique.test(value)
  }
}
