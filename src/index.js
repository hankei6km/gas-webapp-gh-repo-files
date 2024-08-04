/**
 * gas-webapp-gh-repo-file.js
 * @copyright (c) 2024 hankei6km
 * @license MIT
 * see "LICENSE.txt" "OPEN_SOURCE_LICENSES.txt" of "webapp-gh-repo-file.zip" in
 * releases(https://github.com/hankei6km/gas-webapp-gh-repo-file/releases)
 */

'use strict'

/**
 * static path を取得する。とりあえず作成、あとでライブラリ側に移すかも。
 */
function staticPath_(u) {
  // node:path 使う方法ない？
  return `build/static/${u}`
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile(staticPath_('index.html'))
}

async function repoToFile(opts) {
  try {
    return await _entry_point_.WebappGhRepoFiles.repoToFile(opts)
  } catch (e) {
    console.error(e)
    throw e.toString()
  }
}
