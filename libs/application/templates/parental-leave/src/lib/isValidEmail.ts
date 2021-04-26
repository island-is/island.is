const regex = /\S+@\S+\.\S+/i

export const isValidEmail = (email: string) => regex.test(email)
