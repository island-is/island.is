import { Handlebars } from '../../types'

const registerHelpers = (ctx: Handlebars) => {
  ctx.registerHelper('ternary', (test, yes, no) =>
    (typeof test === 'function' ? test.call(this) : test) ? yes : no,
  )
  ctx.registerHelper('eq', (a, b) => a === b)
}

export default registerHelpers
