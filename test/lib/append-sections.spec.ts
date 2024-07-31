import { toHtml } from 'hast-util-to-html'
import { genAppendSections } from '../../src/lib/append-sections.js'
import type { AppendSectionInfo } from '../../src/lib/append-sections.js'

describe('genAppendSections', () => {
  it('should return an empty array if no append sections are provided', async () => {
    const appendSections: AppendSectionInfo[] = []
    const result = await genAppendSections(appendSections)
    expect(result).toEqual({ children: [], type: 'root' })
  })

  it('should generate the correct HTML structure for each append section', async () => {
    const appendSections: AppendSectionInfo[] = [
      {
        heading: '<b>Section</b> 1',
        paragraph: 'This is <b>section</b> 1',
        codeBlock: 'console.log("<b>Section</b> 1")'
      },
      {
        heading: '<b>Section</b> 2',
        paragraph: 'This is <b>section</b> 2',
        codeBlock: 'console.log("<b>Section</b> 2")'
      }
    ]
    const result = toHtml(await genAppendSections(appendSections))
    expect(result).toMatchInlineSnapshot(
      `"<h2>&#x3C;b>Section&#x3C;/b> 1</h2><p>This is &#x3C;b>section&#x3C;/b> 1</p><pre><code>console.log("&#x3C;b>Section&#x3C;/b> 1")</code></pre><h2>&#x3C;b>Section&#x3C;/b> 2</h2><p>This is &#x3C;b>section&#x3C;/b> 2</p><pre><code>console.log("&#x3C;b>Section&#x3C;/b> 2")</code></pre>"`
    )
  })

  it('should handle empty paragraph in append sections', async () => {
    const appendSections: AppendSectionInfo[] = [
      {
        heading: '<b>Section</b> 1',
        paragraph: '',
        codeBlock: 'console.log("<b>Section</b> 1")'
      },
      {
        heading: '<b>Section</b> 2',
        paragraph: '',
        codeBlock: 'console.log("<b>Section</b> 2")'
      }
    ]
    const result = toHtml(await genAppendSections(appendSections))
    expect(result).toMatchInlineSnapshot(
      `"<h2>&#x3C;b>Section&#x3C;/b> 1</h2><pre><code>console.log("&#x3C;b>Section&#x3C;/b> 1")</code></pre><h2>&#x3C;b>Section&#x3C;/b> 2</h2><pre><code>console.log("&#x3C;b>Section&#x3C;/b> 2")</code></pre>"`
    )
  })

  it('should handle empty code block in append sections', async () => {
    const appendSections: AppendSectionInfo[] = [
      {
        heading: '<b>Section</b> 1',
        paragraph: 'This is <b>section</b> 1',
        codeBlock: ''
      },
      {
        heading: '<b>Section</b> 2',
        paragraph: 'This is <b>section</b> 2',
        codeBlock: ''
      }
    ]
    const result = toHtml(await genAppendSections(appendSections))
    expect(result).toMatchInlineSnapshot(
      `"<h2>&#x3C;b>Section&#x3C;/b> 1</h2><p>This is &#x3C;b>section&#x3C;/b> 1</p><h2>&#x3C;b>Section&#x3C;/b> 2</h2><p>This is &#x3C;b>section&#x3C;/b> 2</p>"`
    )
  })
})
