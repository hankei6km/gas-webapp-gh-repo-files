/**
 * gas-webapp-gh-repo-file.js
 * @copyright (c) 2024 hankei6km
 * @license MIT
 * See "LICENSE.txt" and "OPEN_SOURCE_LICENSES.txt". Also, refer to the files under the "static" directory
 * in the "webapp-gh-repo-file.zip" releases (https://github.com/hankei6km/gas-webapp-gh-repo-file/releases).
 */

'use strict'

/**
 * static path を取得する。とりあえず作成、あとでライブラリ側に移すかも。
 */
function staticPath_(u) {
  // node:path 使う方法ない？
  return `build/static/${u}`
}

function pageTitle_() {
  return 'リポジトリのファイルツリーを Google ドライブへ保存'
}

function doGet(e) {
  const path = e.pathInfo || 'index.html'
  // console.log(JSON.stringify(e, null, 2))
  if (path === 'index.html') {
    const template = HtmlService.createTemplateFromFile(staticPath_(path))
    template.url = ScriptApp.getService().getUrl()
    const htmlOutput = template.evaluate()
    htmlOutput.setTitle(pageTitle_())
    htmlOutput.addMetaTag('viewport', 'width=device-width, initial-scale=1')
    return htmlOutput
  }
}

async function repoToFile(opts) {
  try {
    return _entry_point_.WebappGhRepoFiles.repoToFile(opts)
  } catch (e) {
    console.error(e)
    throw e.toString()
  }
}
