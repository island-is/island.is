#!/usr/bin/env zx
import yargs from 'yargs'

;(async () => {
  const files = (await $`git diff --name-only ${process.argv[3]}...${process.argv[4]} -- $(find ${__dirname}/../apps -name 'migrations')`).stdout.split('\n')
  for (const file of files) {
    console.log(`File: ${file}`)
    const pos = file.indexOf('migrations')
    cd (path.join(__dirname, '..', file.substring(0, pos-1)))
    await $`npx sequelize-cli db:migrate:undo --name ${file}`
  }
  console.log('Sequilize Undo Complete')
})()
