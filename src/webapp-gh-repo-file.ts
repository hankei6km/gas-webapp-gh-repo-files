export namespace WebappGhRepoFiles {
  export function chk() {
    const c = new GhRepoFiles.GasClient({
      owner: 'hankei6km',
      repo: 'gas-gh-repo-files'
    })
    return c
  }
}
