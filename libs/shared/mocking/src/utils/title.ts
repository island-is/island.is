import { faker } from '@faker-js/faker'

export const title = () => {
  const words = faker.lorem.words()
  return `${words[0].toUpperCase()}${words.slice(1)}`
}
