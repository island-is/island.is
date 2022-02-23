import { execSync } from 'child_process'

export class SimpleGit {
  constructor(private cwd: string) {}
  async git(...args: string[]) {
    const command = `git ${args.join(' ')}`
    try {
      console.log(`In: ${command}`)
      const out = execSync(command, {
        cwd: this.cwd,
        encoding: 'utf-8',
      })
      console.log(`Out: ${out}`)
      return Promise.resolve(out)
    } catch (e) {
      console.error(`In: ${command}`)
      console.error(`Error: ${e.message}`)
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
  merge = this._method('checkout', '-b')
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
