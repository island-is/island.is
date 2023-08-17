import { defineConfig } from '@island.is/nest/config'

export const userModuleConfig = defineConfig({
  name: 'UserModule',
  load: (env) => ({
    adminUsers: env.requiredJSON('ADMIN_USERS', [
      {
        id: '8f8f6522-95c8-46dd-98ef-cbc198544871',
        nationalId: '3333333333',
        name: 'Addi Admin',
        title: 'notendaumsjón',
      },
      {
        id: '66430be4-a662-442b-bf97-1858a64ab685',
        nationalId: '4444444444',
        name: 'Solla Sýsla',
        title: 'notendaumsjón',
      },
    ]),
  }),
})
