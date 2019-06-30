import * as shared from '../sharedTypes.js'
import * as elements from '../elements.js'
import * as random from 'lib0/random.js'
import * as math from 'lib0/math.js'
import { usercolors } from '../usercolors.js'
import { html, render } from 'lit-html'

const input = /** @type {any} */ (elements.intro.querySelector('input'))

input.addEventListener('input', e => {
  localStorage.setItem('username', input.value)
  updateAwarenessFromLocalstorage()
})

const updateAwarenessFromLocalstorage = () => {
  const localstorageUsername = localStorage.getItem('username')
  const awarenessState = shared.provider.awareness.getLocalState()
  if (localstorageUsername != null && awarenessState !== null && localstorageUsername !== awarenessState.username) {
    shared.provider.awareness.setLocalStateField('username', localstorageUsername || 'Anonymous') 
    input.value = localstorageUsername
  }
}

addEventListener('storage', updateAwarenessFromLocalstorage)

if (localStorage.getItem('username') == null) {
  localStorage.setItem('username', `User ${shared.doc.clientID.toString().slice(-4)}`)
}

input.value = localStorage.getItem('username')
input.removeAttribute('hidden')

const userColor = usercolors[random.uint32() % usercolors.length]

shared.provider.awareness.setLocalState({
  username: localStorage.getItem('username') || 'Anonymous',
  color: userColor.color,
  colorLight: userColor.light
})

document.documentElement.style.setProperty('--user-color', userColor.color);
document.documentElement.style.setProperty('--user-light', userColor.light);


/* mouse renderer */

// compute & share local position
elements.intro.addEventListener('mousemove', /** @param {any} event */event => {
  const infoRect = elements.intro.getBoundingClientRect()
  // compute x relative to infoRect and relative to dimension
  const x = (event.clientX - infoRect.left) / infoRect.width
  const y = (event.clientY - infoRect.top) / infoRect.height
  shared.awareness.setLocalStateField('introMouse', { x, y })
})

elements.intro.addEventListener('mouseleave', /** @param {any} event */event => {
  shared.awareness.setLocalStateField('introMouse', null)
})

const renderCursors = () => {
  const infoRect = elements.intro.getBoundingClientRect()
  const cursors = Array.from(shared.awareness.getStates().entries())
    .filter(([userid, state]) => userid !== shared.doc.clientID && state.introMouse != null)
    .map(([userid, state]) => html`<div style="background-color:${state.color};top:${math.floor(state.introMouse.y * infoRect.height)}px;left:${math.floor(state.introMouse.x * infoRect.width)}px"></div>`)
  render(html`${cursors}`, elements.introCursors)
}

renderCursors()
shared.awareness.on('change', renderCursors)
