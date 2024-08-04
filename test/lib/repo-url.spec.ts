import { RepoUrl } from '../../src/lib/repo-url'

describe('RepoUrl', () => {
  it('should parse url(https://github.com/hankei6km/gas-webapp-gh-repo-files)', () => {
    const url = new RepoUrl(
      'https://github.com/hankei6km/gas-webapp-gh-repo-files'
    )
    expect(url.owner).toBe('hankei6km')
    expect(url.repo).toBe('gas-webapp-gh-repo-files')
    expect(url.ref).toBe('')
  })
  it('should parse url(https://github.com/hankei6km/gas-webapp-gh-repo-files/commit/ae85cdde03f2880109f486b5241964fe51a5eb75)', () => {
    const url = new RepoUrl(
      'https://github.com/hankei6km/gas-webapp-gh-repo-files/commit/ae85cdde03f2880109f486b5241964fe51a5eb75'
    )
    expect(url.owner).toBe('hankei6km')
    expect(url.repo).toBe('gas-webapp-gh-repo-files')
    expect(url.ref).toBe('ae85cdde03f2880109f486b5241964fe51a5eb75')
  })
  it('should parse url(https://github.com/hankei6km/gas-webapp-gh-repo-files/tree/ae85cdde03f2880109f486b5241964fe51a5eb75)', () => {
    const url = new RepoUrl(
      'https://github.com/hankei6km/gas-webapp-gh-repo-files/tree/ae85cdde03f2880109f486b5241964fe51a5eb75'
    )
    expect(url.owner).toBe('hankei6km')
    expect(url.repo).toBe('gas-webapp-gh-repo-files')
    expect(url.ref).toBe('ae85cdde03f2880109f486b5241964fe51a5eb75')
  })
  it('should parse url(https://github.com/hankei6km/gas-webapp-gh-repo-files/tree/test/webapp)', () => {
    const url = new RepoUrl(
      'https://github.com/hankei6km/gas-webapp-gh-repo-files/tree/test/webapp'
    )
    expect(url.owner).toBe('hankei6km')
    expect(url.repo).toBe('gas-webapp-gh-repo-files')
    expect(url.ref).toBe('test/webapp')
  })
  it('should parse url(hankei6km/gas-webapp-gh-repo-files)', () => {
    const url = new RepoUrl('hankei6km/gas-webapp-gh-repo-files')
    expect(url.owner).toBe('hankei6km')
    expect(url.repo).toBe('gas-webapp-gh-repo-files')
    expect(url.ref).toBe('')
  })
  it('should parse url(hankei6km/gas-webapp-gh-repo-files/ae85cdde03f2880109f486b5241964fe51a5eb75)', () => {
    const url = new RepoUrl(
      'hankei6km/gas-webapp-gh-repo-files/ae85cdde03f2880109f486b5241964fe51a5eb75'
    )
    expect(url.owner).toBe('hankei6km')
    expect(url.repo).toBe('gas-webapp-gh-repo-files')
    expect(url.ref).toBe('ae85cdde03f2880109f486b5241964fe51a5eb75')
  })
  it('should parse url(hankei6km/gas-webapp-gh-repo-files/test/webapp)', () => {
    const url = new RepoUrl('hankei6km/gas-webapp-gh-repo-files/test/webapp')
    expect(url.owner).toBe('hankei6km')
    expect(url.repo).toBe('gas-webapp-gh-repo-files')
    expect(url.ref).toBe('test/webapp')
  })
})
