import { GraphQLScalarType } from 'graphql'

export default {
  StringTrimmed: new GraphQLScalarType({
    name: 'StringTrimmed',
    description: 'String that is trimmed',
    parseValue: (value) => value.trim(),
  }),
}
