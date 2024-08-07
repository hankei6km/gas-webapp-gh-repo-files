import Url from 'url-parse'
import { toFile } from './lib/to-file.js'
import { RepoUrl } from './lib/repo-url.js'

export namespace WebappGhRepoFiles {
  export type FileFormat = 'document' | 'html' | 'pdf' | 'markdown'
  export async function repoToFile(opts: {
    url: string
    fileFormat?: FileFormat
  }) {
    const props = PropertiesService.getScriptProperties()
    const folderId = props.getProperty('FOLDER_ID') || ''

    const { owner, repo, ref } = new RepoUrl(opts.url)
    const client = new (GhRepoFiles.getGasClient())({
      owner,
      repo,
      ref
    })
    //if (opts.description) {
    //  client.description = opts.description
    //}

    try {
      const res = await toFile(client, {
        folderId,
        fileFormat: opts.fileFormat
      })
      if (res.id && res.done !== 'none') {
        const url = new Url('https://drive.google.com')
          .set('pathname', `/file/d/${res.id}/view`)
          .set('query', { usp: 'sharing' })
        return {
          url: url.toString(),
          ...res
        }
      }
    } catch (e) {
      throw new Error((e as any).message)
    }
  }
}
