import { pdmshellDocs, type DocChunk } from './pdmshell-docs'

let _docs: DocChunk[] = pdmshellDocs
let _lastSyncSha: string | null = null
let _lastSyncTime: Date | null = null
const _listeners: Array<() => void> = []

export function getDocs(): DocChunk[] {
  return _docs
}

export function getLastSyncSha(): string | null {
  return _lastSyncSha
}

export function updateDocs(docs: DocChunk[], sha: string): void {
  _docs = docs
  _lastSyncSha = sha
  _lastSyncTime = new Date()
  for (const listener of _listeners) {
    listener()
  }
}

export function getSyncStatus() {
  return {
    docCount: _docs.length,
    lastSyncSha: _lastSyncSha,
    lastSyncTime: _lastSyncTime
  }
}

export function onDocsUpdated(callback: () => void): void {
  _listeners.push(callback)
}
