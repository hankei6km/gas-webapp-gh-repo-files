import { h } from 'hastscript'
import type { Child } from 'hastscript'
import { sanitize, defaultSchema } from 'hast-util-sanitize'

export type AppendSectionInfo = {
  heading: string
  paragraph: string
  codeBlock: string
}
export async function genAppendSections(appendSections: AppendSectionInfo[]) {
  const children: Child = []
  for (const s of appendSections) {
    children.push(h('h2', s.heading))
    if (s.paragraph) {
      children.push(h('p', s.paragraph))
    }
    if (s.codeBlock) {
      children.push(h('pre', h('code', s.codeBlock)))
    }
  }
  return sanitize(h(null, children), defaultSchema)
}
