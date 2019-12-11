
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

export const doc = new Y.Doc()
export const provider = new WebrtcProvider('yjs-website', doc)
export const awareness = provider.awareness
export const prosemirrorEditorContent = /** @type {Y.XmlFragment} */ (doc.get('prosemirror', Y.XmlFragment))
/**
 * An array of draw element.
 * A draw element is a Y.Map that has a type attribute. We will support only type "path", but you could also define type "text", or type "rectangle".
 *
 * @type {Y.Array<Y.Map<Y.Array|String|object>>}
 */
export const drawingContent = doc.getArray('drawing')

// @ts-ignore
window.ydoc = doc
// @ts-ignore
window.awareness = awareness
// @ts-ignore
window.provider = provider
