import { Handlebars } from '../../types'

const registerHelpers = (ctx: Handlebars) => {
  ctx.registerHelper('ternary', function (test, yes, no) {
    return (typeof test === 'function' ? test.call(ctx) : test) ? yes : no
  })
}

export default registerHelpers
