import { jest } from '@jest/globals'
import { toFile } from '../../src/lib/to-file.js'

const saveDrive = global.Drive
const saveUtilities = global.Utilities
const saveGhRepoFiles = global.GhRepoFiles
describe('toFile', () => {
  beforeEach(() => {
    global.Drive = {} as any
    global.Drive.Files = {
      create: jest.fn().mockReturnValue({ id: 'created id' }) as any,
      update: jest.fn().mockReturnValue({ id: 'updated id' }) as any,
      list: jest.fn().mockReturnValue({ files: [] })
    } as any
    global.Utilities = {
      newBlob: jest.fn().mockReturnValue({
        setDataFromString: jest.fn().mockReturnThis(),
        setContentType: jest.fn().mockReturnThis()
      }) as any
    } as any
    global.GhRepoFiles = {} as any
    global.GhRepoFiles.filesToHtml = jest
      .fn()
      .mockReturnValue('dummy html') as any
    global.GhRepoFiles.filesToMarkdown = jest
      .fn()
      .mockReturnValue('dummy markdown') as any
  })
  afterEach(() => {
    global.Drive = saveDrive
    global.Utilities = saveUtilities
    global.GhRepoFiles = saveGhRepoFiles
  })
  class Client {
    protected get documentName(): string {
      return 'owner repo main'
    }
    protected fetch(): Promise<Uint8Array> {
      throw new Error('Method not implemented.')
    }
  }

  it('save to google document file(create)', async () => {
    const client = new Client()

    expect(await toFile(client as any, { folderId: 'dummy' })).toEqual({
      id: 'created id',
      done: 'created',
      fileName: 'owner repo main'
    })

    expect((global.Drive.Files as any).list as any).toHaveBeenCalledWith({
      q: "name = 'owner repo main' and 'dummy' in parents and trashed=false"
    })
    expect(global.GhRepoFiles.filesToHtml as any).toHaveBeenCalledWith(client)
    expect(global.GhRepoFiles.filesToMarkdown as any).toHaveBeenCalledTimes(0)
    const blob = (global.Utilities.newBlob as jest.Mock).mock.results.pop()
    expect((blob as any)?.value.setContentType).toHaveBeenCalledWith(
      'text/html'
    )
    expect((blob as any)?.value.setDataFromString).toHaveBeenCalledWith(
      'dummy html',
      'UTF-8'
    )
    expect(
      ((global.Drive.Files as any).create as any).mock.calls[0][0]
    ).toEqual({
      name: 'owner repo main',
      mimeType: 'application/vnd.google-apps.document',
      parents: ['dummy']
    })
    expect((global.Drive.Files as any).update as any).toHaveBeenCalledTimes(0)
  })

  it('save to google document file(update)', async () => {
    const client = new Client()
    ;(global.Drive.Files as any).list = jest.fn().mockReturnValue({
      files: [{ id: 'dummy exist id' }]
    }) as any

    expect(await toFile(client as any, { folderId: 'dummy' })).toEqual({
      id: 'updated id',
      done: 'updated',
      fileName: 'owner repo main'
    })

    expect((global.Drive.Files as any).list as any).toHaveBeenCalledWith({
      q: "name = 'owner repo main' and 'dummy' in parents and trashed=false"
    })
    expect(global.GhRepoFiles.filesToHtml as any).toHaveBeenCalledWith(client)
    expect(global.GhRepoFiles.filesToMarkdown as any).toHaveBeenCalledTimes(0)
    const blob = (global.Utilities.newBlob as jest.Mock).mock.results.pop()
    expect((blob as any)?.value.setContentType).toHaveBeenCalledWith(
      'text/html'
    )
    expect((blob as any)?.value.setDataFromString).toHaveBeenCalledWith(
      'dummy html',
      'UTF-8'
    )
    expect((global.Drive.Files as any).create as any).toHaveBeenCalledTimes(0)
    expect((global.Drive.Files as any).create as any).toHaveBeenCalledTimes(0)
    expect(
      ((global.Drive.Files as any).update as any).mock.calls[0][0]
    ).toEqual({ title: 'owner repo main' })
  })

  it('save to html file(create)', async () => {
    const client = new Client()

    expect(
      await toFile(client as any, { folderId: 'dummy', fileFormat: 'html' })
    ).toEqual({
      id: 'created id',
      done: 'created',
      fileName: 'owner repo main.html'
    })

    expect((global.Drive.Files as any).list as any).toHaveBeenCalledWith({
      q: "name = 'owner repo main.html' and 'dummy' in parents and trashed=false"
    })
    expect(global.GhRepoFiles.filesToHtml as any).toHaveBeenCalledWith(client)
    expect(global.GhRepoFiles.filesToMarkdown as any).toHaveBeenCalledTimes(0)
    const blob = (global.Utilities.newBlob as jest.Mock).mock.results.pop()
    expect((blob as any)?.value.setContentType).toHaveBeenCalledWith(
      'text/html'
    )
    expect((blob as any)?.value.setDataFromString).toHaveBeenCalledWith(
      'dummy html',
      'UTF-8'
    )
    expect(
      ((global.Drive.Files as any).create as any).mock.calls[0][0]
    ).toEqual({
      name: 'owner repo main.html',
      mimeType: 'text/html',
      parents: ['dummy']
    })
    expect((global.Drive.Files as any).update as any).toHaveBeenCalledTimes(0)
  })

  it('save to html file(update)', async () => {
    const client = new Client()
    ;(global.Drive.Files as any).list = jest.fn().mockReturnValue({
      files: [{ id: 'dummy exist id' }]
    }) as any

    expect(
      await toFile(client as any, { folderId: 'dummy', fileFormat: 'html' })
    ).toEqual({
      id: 'updated id',
      done: 'updated',
      fileName: 'owner repo main.html'
    })

    expect((global.Drive.Files as any).list as any).toHaveBeenCalledWith({
      q: "name = 'owner repo main.html' and 'dummy' in parents and trashed=false"
    })
    expect(global.GhRepoFiles.filesToHtml as any).toHaveBeenCalledWith(client)
    expect(global.GhRepoFiles.filesToMarkdown as any).toHaveBeenCalledTimes(0)
    const blob = (global.Utilities.newBlob as jest.Mock).mock.results.pop()
    expect((blob as any)?.value.setContentType).toHaveBeenCalledWith(
      'text/html'
    )
    expect((blob as any)?.value.setDataFromString).toHaveBeenCalledWith(
      'dummy html',
      'UTF-8'
    )
    expect((global.Drive.Files as any).create as any).toHaveBeenCalledTimes(0)
    expect((global.Drive.Files as any).create as any).toHaveBeenCalledTimes(0)
    expect(
      ((global.Drive.Files as any).update as any).mock.calls[0][0]
    ).toEqual({ title: 'owner repo main.html' })
  })

  it('save to makrdown file(create)', async () => {
    const client = new Client()

    expect(
      await toFile(client as any, { folderId: 'dummy', fileFormat: 'markdown' })
    ).toEqual({
      id: 'created id',
      done: 'created',
      fileName: 'owner repo main.md'
    })

    expect((global.Drive.Files as any).list as any).toHaveBeenCalledWith({
      q: "name = 'owner repo main.md' and 'dummy' in parents and trashed=false"
    })
    expect(global.GhRepoFiles.filesToHtml as any).toHaveBeenCalledTimes(0)
    expect(global.GhRepoFiles.filesToMarkdown as any).toHaveBeenCalledWith(
      client
    )
    const blob = (global.Utilities.newBlob as jest.Mock).mock.results.pop()
    expect((blob as any)?.value.setContentType).toHaveBeenCalledWith(
      'text/plain'
    )
    expect((blob as any)?.value.setDataFromString).toHaveBeenCalledWith(
      'dummy markdown',
      'UTF-8'
    )
    expect(
      ((global.Drive.Files as any).create as any).mock.calls[0][0]
    ).toEqual({
      name: 'owner repo main.md',
      mimeType: 'text/plain',
      parents: ['dummy']
    })
    expect((global.Drive.Files as any).update as any).toHaveBeenCalledTimes(0)
  })

  it('save to html file(update)', async () => {
    const client = new Client()
    ;(global.Drive.Files as any).list = jest.fn().mockReturnValue({
      files: [{ id: 'dummy exist id' }]
    }) as any

    expect(
      await toFile(client as any, { folderId: 'dummy', fileFormat: 'markdown' })
    ).toEqual({
      id: 'updated id',
      done: 'updated',
      fileName: 'owner repo main.md'
    })

    expect((global.Drive.Files as any).list as any).toHaveBeenCalledWith({
      q: "name = 'owner repo main.md' and 'dummy' in parents and trashed=false"
    })
    expect(global.GhRepoFiles.filesToHtml as any).toHaveBeenCalledTimes(0)
    expect(global.GhRepoFiles.filesToMarkdown as any).toHaveBeenCalledWith(
      client
    )
    const blob = (global.Utilities.newBlob as jest.Mock).mock.results.pop()
    expect((blob as any)?.value.setContentType).toHaveBeenCalledWith(
      'text/plain'
    )
    expect((blob as any)?.value.setDataFromString).toHaveBeenCalledWith(
      'dummy markdown',
      'UTF-8'
    )
    expect((global.Drive.Files as any).create as any).toHaveBeenCalledTimes(0)
    expect((global.Drive.Files as any).create as any).toHaveBeenCalledTimes(0)
    expect(
      ((global.Drive.Files as any).update as any).mock.calls[0][0]
    ).toEqual({ title: 'owner repo main.md' })
  })

  it('save to pdf file(create)', async () => {
    const client = new Client()

    expect(
      await toFile(client as any, { folderId: 'dummy', fileFormat: 'pdf' })
    ).toEqual({
      id: 'created id',
      done: 'created',
      fileName: 'owner repo main.pdf'
    })

    expect((global.Drive.Files as any).list as any).toHaveBeenCalledWith({
      q: "name = 'owner repo main.pdf' and 'dummy' in parents and trashed=false"
    })
    expect(global.GhRepoFiles.filesToHtml as any).toHaveBeenCalledWith(client)
    expect(global.GhRepoFiles.filesToMarkdown as any).toHaveBeenCalledTimes(0)
    const blob = (global.Utilities.newBlob as jest.Mock).mock.results.pop()
    expect((blob as any)?.value.setContentType).toHaveBeenCalledWith(
      'text/html'
    )
    expect((blob as any)?.value.setDataFromString).toHaveBeenCalledWith(
      'dummy html',
      'UTF-8'
    )
    expect(
      ((global.Drive.Files as any).create as any).mock.calls[0][0]
    ).toEqual({
      name: 'owner repo main.pdf',
      mimeType: 'application/pdf',
      parents: ['dummy']
    })
    expect((global.Drive.Files as any).update as any).toHaveBeenCalledTimes(0)
  })

  it('save to pdf file(update)', async () => {
    const client = new Client()
    ;(global.Drive.Files as any).list = jest.fn().mockReturnValue({
      files: [{ id: 'dummy exist id' }]
    }) as any

    expect(
      await toFile(client as any, { folderId: 'dummy', fileFormat: 'pdf' })
    ).toEqual({
      id: 'updated id',
      done: 'updated',
      fileName: 'owner repo main.pdf'
    })

    expect((global.Drive.Files as any).list as any).toHaveBeenCalledWith({
      q: "name = 'owner repo main.pdf' and 'dummy' in parents and trashed=false"
    })
    expect(global.GhRepoFiles.filesToHtml as any).toHaveBeenCalledWith(client)
    expect(global.GhRepoFiles.filesToMarkdown as any).toHaveBeenCalledTimes(0)
    const blob = (global.Utilities.newBlob as jest.Mock).mock.results.pop()
    expect((blob as any)?.value.setContentType).toHaveBeenCalledWith(
      'text/html'
    )
    expect((blob as any)?.value.setDataFromString).toHaveBeenCalledWith(
      'dummy html',
      'UTF-8'
    )
    expect((global.Drive.Files as any).create as any).toHaveBeenCalledTimes(0)
    expect(
      ((global.Drive.Files as any).update as any).mock.calls[0][0]
    ).toEqual({ title: 'owner repo main.pdf' })
  })

  it('escape filename', async () => {
    const client = new (class ClientDocumentName extends Client {
      protected get documentName(): string {
        return "owner repo main's"
      }
    })()

    expect(await toFile(client as any, { folderId: 'dummy' })).toEqual({
      id: 'created id',
      done: 'created',
      fileName: "owner repo main's"
    })

    expect((global.Drive.Files as any).list as any).toHaveBeenCalledWith({
      q: "name = 'owner repo main\\'s' and 'dummy' in parents and trashed=false"
    })
  })
})
