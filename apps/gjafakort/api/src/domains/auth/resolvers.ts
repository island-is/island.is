class AuthResolver {
  public getUser(_1, _2, { user }) {
    if (!user) {
      return null
    }
    return {
      ssn: user.ssn,
      name: user.name,
      mobile: user.mobile,
    }
  }
}

const resolver = new AuthResolver()
export default {
  Query: {
    user: resolver.getUser,
  },
}
