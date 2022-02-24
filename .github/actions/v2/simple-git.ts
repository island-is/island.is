import Debug from 'debug'
import { execSync, exec as ex, spawn as sp } from 'child_process'
import { promisify } from 'util'
const exec = promisify(ex)
const spawn = promisify(sp)

export class SimpleGit {
  constructor(
    private cwd: string,
    private _shell: string = `/usr/bin/bash`,
    private _log = Debug('simple-git'),
  ) {}
  public get shell() {
    return this._shell
  }
  async git(...args: string[]) {
    const command = `git ${args.join(' ')}`
    try {
      this._log(`In: ${command}`)
      const { stdout, stderr } = await exec(command, {
        cwd: this.cwd,
        shell: this._shell,
        encoding: 'utf-8',
      })
      this._log(`StdOut: ${stdout}`)
      this._log(`StdErr: ${stderr}`)
      return Promise.resolve(stdout)
    } catch (e) {
      this._log(`Error, in: ${command}`)
      this._log(`Error, out: ${e.message}`)

      return Promise.reject(e)
    }
  }
  private _method(...name: string[]) {
    return (...args: string[]) => {
      return this.git(...name, ...args)
    }
  }
  raw = this.git
  add = this._method('add')
  init = this._method('init', '.')
  async commit(message: string) {
    await this.git('commit', '-m', message)
    const lastMessage = await this.log({ maxCount: 1 })
    return lastMessage.latest.hash
  }
  checkoutLocalBranch = this._method('checkout', '-b')
  checkoutBranch = this._method('checkout', '-b')
  merge = this._method('merge')
  checkout = this._method('checkout')
  async log(params: { maxCount: number }) {
    const out = await this.git(
      'log',
      `-n ${params.maxCount}`,
      `--pretty=format:'{"commit": "%H",  "abbreviated_commit": "%h",  "tree": "%T", "abbreviated_tree": "%t", "parent": "%P", "abbreviated_parent": "%p", "refs": "%D", "date": "%aD"}'`,
    )

    const logs = out
      .split('\n')
      .map((s) => s.trim())
      .map((s) => JSON.parse(s) as any)
      .map((s) => ({
        hash: s.commit as string,
      }))
    return {
      latest: logs[0],
    }
  }
  async mergeFromTo(from: string, to: string) {
    await this.git('checkout', to)
    await this.git('merge', from)
  }
}
