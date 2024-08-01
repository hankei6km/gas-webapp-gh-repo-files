export async function toFile(
  repoOpts: GhRepoFilesClient.ClientOpts,
  opts: {
    folderId: string
    fileFormat?: 'document' | 'html' | 'pdf' | 'markdown'
    description?: string
    pushedAt?: number
  }
) {
  console.log('start')

  const [dataMimeType, fileMimeType, fileExt] = (() => {
    if (
      typeof opts.fileFormat === 'undefined' ||
      opts.fileFormat === 'document'
    ) {
      return ['text/html', 'application/vnd.google-apps.document', '']
    } else if (opts.fileFormat === 'html') {
      return ['text/html', 'text/html', 'html']
    } else if (opts.fileFormat === 'pdf') {
      return ['text/html', 'application/pdf', 'pdf']
    } else if (opts.fileFormat === 'markdown') {
      return ['text/plain', 'text/plain', 'md']
    }
    return ['text/plain', 'text/plain', 'txt']
  })()

  const c = new (GhRepoFiles.getGasClient())(repoOpts)
  if (opts.description) {
    c.description = opts.description
  }
  //console.log(t)
  const fileName = c.documentName + `${fileExt && `.${fileExt}`}`
  const existFileId = getExistFileId_(opts.folderId, fileName)
  if (existFileId) {
    const file = DriveApp.getFileById(existFileId)
    const updated = new Date(file.getLastUpdated().toString()).valueOf()
    if (opts.pushedAt && opts.pushedAt < updated) {
      // push されている分は更新されているとみなす。
      //(Google Document のファイルはメタ情報の更新でもタイムスタンプが更新されれるので絶対ではない)
      console.log('already updated')
      return
    }
  }

  const body =
    dataMimeType === 'text/html'
      ? await GhRepoFiles.filesToHtml(c)
      : await GhRepoFiles.filesToMarkdown(c)
  const mediaData = Utilities.newBlob('')
    .setDataFromString(body, 'UTF-8')
    .setContentType(dataMimeType)

  let res = {}
  if (existFileId) {
    console.log('- update')
    const resource = {
      title: fileName
    }
    // v3 の型定義はないらしいので、とりあえずany
    res = Drive.Files?.update(resource, existFileId, mediaData) || {}
  } else {
    console.log('- create')
    // https://stackoverflow.com/questions/77752561/how-to-convert-docx-files-to-google-docs-with-apps-script-2024-drive-api-v3
    const resource = {
      name: fileName,
      parents: [opts.folderId],
      mimeType: fileMimeType
    }
    // v3 の型定義はないらしいので、とりあえずany
    res = (Drive.Files as any).create(resource, mediaData)
  }

  console.log(res)
  console.log('end')
}

const escapeQueryStringRegExp_ = new RegExp("'", 'g')
function escapeQueryString_(str: string) {
  return str.replace(escapeQueryStringRegExp_, "\\'")
}

function getExistFileId_(folderId: string, documentName: string) {
  // v3 の型定義はないらしいので、とりあえずany
  const f = (Drive.Files as any).list({
    q: `name = '${escapeQueryString_(
      documentName
    )}' and '${folderId}' in parents and trashed=false`
  })
  if (f.files.length > 0) {
    return f.files[0].id
  }
  return ''
}
