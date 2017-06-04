// https://github.com/ElemeFE/mint-ui/blob/master/packages/loadmore/src/loadmore.vue#L199
export function getScrollEventTarget(element) {
  let currentNode = element;
  while (
    currentNode &&
    currentNode.tagName !== 'HTML' &&
    currentNode.tagName !== 'BODY' &&
    currentNode.nodeType === 1
  ) {
    const overflowY = document.defaultView.getComputedStyle(currentNode).overflowY;
    if (overflowY === 'scroll' || overflowY === 'auto') {
      return currentNode;
    }
    currentNode = currentNode.parentNode;
  }
  return window;
}

// https://github.com/ElemeFE/mint-ui/blob/master/packages/loadmore/src/loadmore.vue#L212
export function getScrollTop(element) {
  if (element === window) {
    return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
  }
  return element.scrollTop;
}
