import { toFile } from './lib/to-file.js'
export namespace WebappGhRepoFiles {
  export async function repoToFile() {
    const props = PropertiesService.getScriptProperties()
    const folderId = props.getProperty('FOLDER_ID') || ''

    await toFile(
      {
        owner: 'hankei6km',
        repo: 'gas-gh-repo-files'
      },
      {
        folderId,
        description: ''
        //fileFormat: 'pdf'
      }
    )
  }
}
