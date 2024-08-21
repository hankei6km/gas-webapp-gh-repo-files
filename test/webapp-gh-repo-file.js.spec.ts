import { jest } from '@jest/globals'
//import { WebappGhRepoFiles } from '../src/webapp-gh-repo-file.js'
import { toFile } from '../src/lib/to-file.js'

jest.unstable_mockModule('../src/lib/to-file.js', () => {
  return {
    toFile: jest
      .fn<typeof toFile>()
      .mockImplementation(async (client, opts) => {
        if (client.documentName.match(/error/)) {
          throw new Error('error')
        }
        return {
          id: 'created-id',
          done: 'created',
          fileName: client.documentName
        }
      })
  }
})

const savePropertiesService = global.PropertiesService
const saveGhRepoFiles = global.GhRepoFiles
describe('repoToFile', () => {
  beforeEach(() => {
    global.PropertiesService = {
      getScriptProperties: jest.fn().mockReturnValue({
        getProperty: jest.fn().mockReturnValue('dummy folder id')
      }) as any
    } as any
    global.GhRepoFiles = {
      getGasClient: jest.fn().mockReturnValue(
        class {
          owner = ''
          repo = ''
          constructor(opts: { owner: string; repo: string }) {
            this.owner = opts.owner
            this.repo = opts.repo
          }
          protected get documentName(): string {
            return `${this.owner} ${this.repo} main`
          }
          protected fetch(): Promise<Uint8Array> {
            throw new Error('Method not implemented.')
          }
        }
      ) as any
    } as any
  })
  afterEach(async () => {
    global.PropertiesService = savePropertiesService
    global.GhRepoFiles = saveGhRepoFiles
    const { toFile } = await import('../src/lib/to-file.js')
    ;(toFile as any).mockClear()
  })
  it('return url', async () => {
    const { WebappGhRepoFiles } = await import('../src/webapp-gh-repo-file.js')
    const { toFile } = await import('../src/lib/to-file.js')
    expect(
      await WebappGhRepoFiles.repoToFile({
        url: 'hankei6km/gas-gh-repo-files'
      })
    ).toEqual({
      url: 'https://drive.google.com/file/d/created-id/view?usp=sharing',
      id: 'created-id',
      done: 'created',
      fileName: 'hankei6km gas-gh-repo-files main'
    })
    const client = (toFile as any).mock.calls[0][0]
    expect(client.owner).toEqual('hankei6km')
    expect(client.repo).toEqual('gas-gh-repo-files')
    expect((toFile as any).mock.calls[0][1]).toEqual({
      folderId: 'dummy folder id'
    })
  })
  it('throw error', async () => {
    const { WebappGhRepoFiles } = await import('../src/webapp-gh-repo-file.js')
    const { toFile } = await import('../src/lib/to-file.js')
    await expect(
      WebappGhRepoFiles.repoToFile({
        url: 'hankei6km/error'
      })
    ).rejects.toThrow('error')
  })
})
