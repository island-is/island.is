import { Handlebars } from '../../types'

const registerHelpers = (ctx: Handlebars) => {
  ctx.registerHelper('ternary', (test, yes, no) =>
    (typeof test === 'function' ? test.call(this) : test) ? yes : no,
  )
}

export default registerHelpers
