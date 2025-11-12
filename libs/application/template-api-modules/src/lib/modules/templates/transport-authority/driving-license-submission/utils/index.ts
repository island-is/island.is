// Note. The frontend application validates
// the phone number according to libphonenumber-js
// for 'IS'.
export const formatPhoneNumber = (phone: string) => {
  return phone
    .trim()
    .replace(/(^00354|^\+354)/g, '') // Remove country code
    .replace(/\D/g, '') // Remove all non-digits
}
