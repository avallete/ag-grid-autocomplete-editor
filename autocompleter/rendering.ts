import { AutocompleteItem, RenderFunction, RenderGroupFunction } from './types'

export function removeChildren(container: Node) {
  while (container.firstChild) {
    container.firstChild.remove()
  }
}

export function defaultRenderGroup(groupName: string): HTMLDivElement {
  const groupDiv = document.createElement('div')
  groupDiv.textContent = groupName
  groupDiv.className = 'group'
  return groupDiv
}

export function defaultRender(item: AutocompleteItem): HTMLDivElement {
  const itemElement = document.createElement('div')
  itemElement.textContent = item.label || ''
  return itemElement
}

export function renderItems<T extends AutocompleteItem>(
  items: T[],
  selected: T | undefined,
  inputValue: string,
  clickHandler: (item: T, event: MouseEvent) => void,
  render: RenderFunction<T> = defaultRender,
  renderGroup: RenderGroupFunction = defaultRenderGroup
): DocumentFragment {
  const fragment = document.createDocumentFragment()
  const elements: HTMLElement[] = []
  let previousGroup = '#9?$'
  // eslint-disable-next-line no-restricted-syntax
  for (const item of items) {
    if (item.group && item.group !== previousGroup) {
      previousGroup = item.group
      const groupDiv = renderGroup(item.group, inputValue)
      elements.push(groupDiv)
    }
    const div = render(item, inputValue)
    div.addEventListener('click', (event: MouseEvent) => clickHandler(item, event))
    if (item === selected) {
      div.classList.add('selected')
    }
    elements.push(div)
  }
  fragment.append(...elements)
  return fragment
}
