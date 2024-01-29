import Debug from 'debug'
import { exec as ex } from 'child_process'
import { promisify } from 'util'

const exec = promisify(ex)

export class SimpleGit {
  constructor(
    private _cwd: string,
    private _shell: string = `/usr/bin/bash`,
    private _log = Debug('simple-git'),
  ) {}
  public get shell() {
    return this._shell
  }
  public get cwd() {
    return this._cwd
  }
  private async git(...args: string[]) {
    const command = `git ${args.join(' ')}`
    try {
      this._log(`In: ${command}`)
      const { stdout, stderr } = await exec(command, {
        cwd: this._cwd,
        shell: this._shell,
        encoding: 'utf-8',
      })
      this._log(`StdOut: ${stdout}`)
      this._log(`StdErr: ${stderr}`)
      return Promise.resolve(stdout)
    } catch (e: any) {
      this._log(`Error, in: ${command}`)
      this._log(`Error, out: ${e.message}`)

      return Promise.reject(e)
    }
  }
  private _curriedCommand(...name: string[]) {
    return (...args: string[]) => {
      return this.git(...name, ...args)
    }
  }
  raw = this.git
  add = this._curriedCommand('add')
  // init = this._curriedCommand('init', '.')
  async init() {
    await this.git('init', '.')
    await this.git('config', 'user.name', 'Islandis')
    await this.git('config', 'user.email', 'ci@island.is')
    await this.git('config', 'user.gpgsign', 'false')
  }
  async commit(message: string) {
    await this.git('commit', '-m', message)
    const lastMessage = await this.lastCommit()
    return lastMessage
  }
  checkoutLocalBranch = this._curriedCommand('checkout', '-b')
  checkoutBranch = this._curriedCommand('checkout', '-b')
  async merge(head: string) {
    await this.git('merge', head)
    const commit = await this.lastCommit()
    return commit
  }
  checkout = this._curriedCommand('checkout')
  async lastCommit() {
    const out = await this.git(
      'log',
      `-n 1`,
      `--pretty=format:'{"commit": "%H",  "abbreviated_commit": "%h",  "tree": "%T", "abbreviated_tree": "%t", "parent": "%P", "abbreviated_parent": "%p", "refs": "%D", "date": "%aD"}'`,
    )

    const logs = out
      .split('\n')
      .map((s) => s.trim())
      .map((s) => JSON.parse(s) as any)
      .map((s) => ({
        hash: s.commit as string,
      }))
    return logs[0].hash
  }
  async mergeFromTo(from: string, to: string) {
    await this.git('checkout', to)
    await this.git('merge', from)
  }
}
