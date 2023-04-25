export const IsEmailValid = (email: string) => {
  console.log("email", email)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default IsEmailValid
