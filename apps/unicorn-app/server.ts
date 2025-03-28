import { bootstrap } from '@island.is/infra-next-server'

// AFFECTME

const f = (g: () => string) => g()
const b = f(function foo() {
  return 'b'
})

bootstrap({
  name: 'unicorn-app',
  appDir: 'apps/unicorn-app',
})
