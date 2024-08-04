import Url from 'url-parse'

export class RepoUrl {
  _owner: string = ''
  _repo: string = ''
  _ref: string = ''
  constructor(public url: string) {
    this.parseUrl()
  }
  protected parseUrl() {
    try {
      const url = new Url(this.url)
      const path = url.pathname.split('/')
      if (path[0] === '') {
        path.shift()
      }
      if (
        (url.protocol === 'https:' ||
          url.protocol === 'git:' ||
          url.protocol === 'ssh:') &&
        url.hostname === 'github.com'
      ) {
        if (path.length === 2) {
          this._owner = path[0]
          this._repo = path[1]
          this._ref = ''
          return
        } else if (path.length > 2 && path[2] === 'commit') {
          // これは違うか？
          this._owner = path[0]
          this._repo = path[1]
          this._ref = path[3]
          return
        } else if (path.length > 2 && path[2] === 'tree') {
          this._owner = path[0]
          this._repo = path[1]
          this._ref = path.slice(3).join('/')
          return
        }
      } else if (url.protocol === '' && url.hostname === '') {
        if (path.length === 2) {
          this._owner = path[0]
          this._repo = path[1]
          this._ref = ''
          return
        } else if (path.length > 2) {
          this._owner = path[0]
          this._repo = path[1]
          this._ref = path.slice(2).join('/')
          return
        }
        throw new Error(`Invalid URL: url: ${this.url}`)
      }
    } catch (e) {
      throw new Error(`Invalid URL: url: ${this.url}, error: ${e}`)
    }
  }
  get owner() {
    return this._owner
  }
  get repo() {
    return this._repo
  }
  get ref() {
    return this._ref
  }
}
