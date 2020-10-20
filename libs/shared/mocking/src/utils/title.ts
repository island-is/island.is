import faker from 'faker'

export const title = () => {
  const words = faker.lorem.words()
  return `${words[0].toUpperCase()}${words.slice(1)}`
}
