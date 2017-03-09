/* global MutationObserver */
const document = require('global/document')
const window = require('global/window')

const onLoads = new WeakMap()
const onUnloads = new WeakMap()

if (window && window.MutationObserver) {
  const observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      const mutation = mutations[i]
      eachMutation(mutation.removedNodes, onUnloads)
      eachMutation(mutation.addedNodes, onLoads)
    }
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

module.exports = function onload (element, onLoad, onUnload) {
  if (onLoad) getOrSetDefault(onLoads, element).push(onLoad)
  if (onUnload) getOrSetDefault(onUnloads, element).push(onUnload)
  return element
}

function getOrSetDefault (weakmap, element) {
  var sofar = weakmap.get(element)
  if (sofar === undefined) {
    weakmap.set(element, sofar = [])
  }
  return sofar
}

function eachMutation (nodes, weakmap) {
  for (var i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    runListeners(weakmap, node)
    if (node.childNodes.length > 0) {
      eachMutation(node.childNodes, weakmap)
    }
  }
}

function runListeners (weakmap, node) {
  if (!weakmap.has(node)) return
  const handlers = weakmap.get(node)
  console.log('handlers', handlers)
  // weakmap.delete(node)
  handlers.forEach(handler => handler(node))
}
