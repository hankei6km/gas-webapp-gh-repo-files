type ToFileRes = { id: string; done: 'created' | 'updated' | 'none' }
export async function toFile(
  client: GhRepoFilesClient.Client,
  opts: {
    folderId: string
    fileFormat?: 'document' | 'html' | 'pdf' | 'markdown'
  }
): Promise<ToFileRes> {
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

  const fileName = client.documentName + `${fileExt && `.${fileExt}`}`
  const existFileId = getExistFileId_(opts.folderId, fileName)

  const body =
    dataMimeType === 'text/html'
      ? await GhRepoFiles.filesToHtml(client)
      : await GhRepoFiles.filesToMarkdown(client)
  const mediaData = Utilities.newBlob('')
    .setDataFromString(body, 'UTF-8')
    .setContentType(dataMimeType)

  const res: ToFileRes = { id: '', done: 'none' }
  if (existFileId) {
    const resource = {
      title: fileName
    }
    // v3 の型定義はないらしいので、とりあえずany
    const updateRes =
      Drive.Files?.update(resource, existFileId, mediaData) || {}

    res.id = updateRes?.id || ''
    res.done = res.id ? 'updated' : 'none'
  } else {
    // https://stackoverflow.com/questions/77752561/how-to-convert-docx-files-to-google-docs-with-apps-script-2024-drive-api-v3
    const resource = {
      name: fileName,
      parents: [opts.folderId],
      mimeType: fileMimeType
    }
    // v3 の型定義はないらしいので、とりあえずany
    const createdRess = (Drive.Files as any).create(resource, mediaData)
    res.id = createdRess?.id || ''
    res.done = res.id ? 'created' : 'none'
  }

  return res
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
