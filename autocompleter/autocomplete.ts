import { removeChildren, renderItems, defaultRenderGroup, defaultRender } from './rendering'
import { AutocompleteItem, EventTrigger, RenderFunction, RenderGroupFunction } from './types'
import singleton from './singleton'

export interface AutocompleteSettings<T extends AutocompleteItem> {
  input: HTMLInputElement
  render?: RenderFunction<T>
  renderGroup?: RenderGroupFunction
  className?: string
  minLength?: number
  emptyMsg?: string
  strict: boolean
  autoselectfirst: boolean
  onFreeTextSelect?: (item: T, input: HTMLInputElement) => void
  onSelect: (item: T | undefined, input: HTMLInputElement, event: KeyboardEvent | MouseEvent) => void
  /**
   * Show autocomplete on focus event. Focus event will ignore the `minLength` property and will always call `fetch`.
   */
  showOnFocus?: boolean
  fetch: (text: string, update: (items: T[] | false) => void, trigger: EventTrigger) => void
  debounceWaitMs?: number
  /**
   * Callback for additional autocomplete customization
   * @param {HTMLInputElement} input - input box associated with autocomplete
   * @param {ClientRect | DOMRect} inputRect - size of the input box and its position relative to the viewport
   * @param {HTMLDivElement} container - container with suggestions
   * @param {number} maxHeight - max height that can be used by autocomplete
   */
  customize?: (
    input: HTMLInputElement,
    inputRect: ClientRect | DOMRect,
    container: HTMLDivElement,
    maxHeight: number
  ) => void
}

export interface AutocompleteResult {
  destroy: () => void
}

const enum Keys {
  Enter = 13,
  Esc = 27,
  Up = 38,
  Down = 40,
  Left = 37,
  Right = 39,
  Shift = 16,
  Ctrl = 17,
  Alt = 18,
  CapsLock = 20,
  WindowsKey = 91,
  Tab = 9,
}

const KEYUP_EVENT_NAME = 'input'

export { AutocompleteItem, EventTrigger }
/* eslint-disable unicorn/no-useless-undefined */

export default function autocomplete<T extends AutocompleteItem>(
  this: any,
  settings: AutocompleteSettings<T>
): AutocompleteResult {
  const [getDocument, setDocument] = singleton(settings.input.ownerDocument || window.document)
  const [getItems, setItems] = singleton<T[]>([])
  const [getInputValue, setInputValue] = singleton('')
  const [getSelected, setSelected] = singleton<T | undefined>(undefined)
  const [getKeypressCounter, setKeypressCounter] = singleton(0)
  const [getDebounceTimer, setDebounceTimer] = singleton<number | undefined>(undefined)

  const {
    strict,
    autoselectfirst,
    onFreeTextSelect,
    minLength,
    showOnFocus,
    input,
    className,
    customize,
    emptyMsg,
  } = settings
  const debounceWaitMs = settings.debounceWaitMs || 0
  const minimumInputLength = minLength || 2
  const container: HTMLDivElement = document.createElement('div')
  const containerStyle = container.style

  container.className = `autocomplete ${className || ''}`
  containerStyle.position = 'fixed'

  const incrementKeypressCounter = () => {
    setKeypressCounter(getKeypressCounter() + 1)
  }

  /**
   * Detach the container from DOM
   */
  function detach(): void {
    if (container) {
      container.remove()
    }
  }

  /**
   * Clear debouncing timer if assigned
   */
  function clearDebounceTimer(): void {
    const debounceTimer = getDebounceTimer()
    if (debounceTimer !== undefined) {
      window.clearTimeout(debounceTimer)
      // eslint-disable-next-line unicorn/no-useless-undefined
      setDebounceTimer(undefined)
    }
  }

  /**
   * Attach the container to DOM
   */
  function attach(): void {
    setDocument(input.ownerDocument || window.document)
    if (!container.parentNode) {
      getDocument().body.append(container)
    }
  }

  /**
   * Check if container for autocomplete is displayed
   */
  function containerDisplayed(): boolean {
    return !!container.parentNode
  }

  /**
   * Clear autocomplete state and hide container
   */
  function clear(): void {
    incrementKeypressCounter()
    setItems([])
    setInputValue('')
    setSelected(undefined)
    detach()
  }

  /**
   * Update autocomplete position to put it under the input field
   */
  function updatePosition(): void {
    if (containerDisplayed()) {
      const document = getDocument()

      containerStyle.height = 'auto'
      containerStyle.width = `${input.offsetWidth}px`

      const inputRect = input.getBoundingClientRect()
      const top = inputRect.top + input.offsetHeight
      let maxHeight = document.defaultView!.innerHeight - top

      if (maxHeight < 0) {
        maxHeight = 0
      }

      containerStyle.top = `${top}px`
      containerStyle.bottom = ''
      containerStyle.left = `${inputRect.left}px`
      containerStyle.maxHeight = `${maxHeight}px`

      if (customize) {
        customize(input, inputRect, container, maxHeight)
      }
    }
  }

  /**
   * Automatically move scroll bar if selected item is not visible
   */
  function updateScroll(): void {
    let element = container.querySelector('.selected') as HTMLDivElement
    if (element) {
      // make group visible
      const previous = element.previousElementSibling
      if (previous && previous.previousElementSibling === null && previous.className.includes('group')) {
        element = previous as HTMLDivElement
      }

      if (element.offsetTop < container.scrollTop) {
        container.scrollTop = element.offsetTop
      } else {
        const selectBottom = element.offsetTop + element.offsetHeight
        const containerBottom = container.scrollTop + container.offsetHeight
        if (selectBottom > containerBottom) {
          container.scrollTop += selectBottom - containerBottom
        }
      }
    }
  }

  /**
   * Handle the click on an item of the selection list
   * @param item: data of the clicked item
   * @param event: MouseEvent who has triggered the selection
   */
  function itemClickHandler(item: T, event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    settings.onSelect(item, input, event)
    clear()
  }

  /**
   * Redraw the autocomplete div element with suggestions
   */
  function update(): void {
    // Clear all child from container
    removeChildren(container)

    const items = getItems()
    const render = settings.render || defaultRender
    const renderGroup = settings.renderGroup || defaultRenderGroup
    const fragment = renderItems<T>(items, getSelected(), getInputValue(), render, renderGroup, itemClickHandler)
    container.append(fragment)
    if (items.length === 0 && strict) {
      // if no items display empty message
      if (emptyMsg) {
        const empty = document.createElement('div')
        empty.className = 'empty'
        empty.textContent = emptyMsg
        container.append(empty)
        setSelected(undefined)
      } else {
        clear()
        return
      }
    }

    attach()
    updatePosition()
    updateScroll()
  }

  function updateIfDisplayed(): void {
    if (containerDisplayed()) {
      update()
    }
  }

  function resizeEventHandler(): void {
    updateIfDisplayed()
  }

  function scrollEventHandler(event: Event): void {
    if (event.target !== container) {
      updateIfDisplayed()
    } else {
      event.preventDefault()
    }
  }

  function debouncedFetch(trigger: EventTrigger) {
    const savedKeypressCounter = getKeypressCounter()
    const debouncingTime = trigger === EventTrigger.Keyboard ? debounceWaitMs : 0
    const { value } = input
    // Hydrate this.items with retrieved items
    const handleFetchResult = (elements: T[] | false) => {
      if (getKeypressCounter() === savedKeypressCounter && elements) {
        setItems(elements)
        setInputValue(value)
        setSelected(elements.length > 0 && autoselectfirst ? elements[0] : undefined)
        update()
      }
    }
    return window.setTimeout(() => {
      settings.fetch(value, handleFetchResult, trigger)
    }, debouncingTime)
  }

  function startFetch(trigger: EventTrigger) {
    // if multiple keys were pressed, before we get update from server,
    // this may cause redrawing our autocomplete multiple times after the last key press.
    // to avoid this, the number of times keyboard was pressed will be
    // saved and checked before redraw our autocomplete box.
    incrementKeypressCounter()

    const { value } = input
    if (value.length >= minimumInputLength || trigger === EventTrigger.Focus) {
      clearDebounceTimer()
      setDebounceTimer(debouncedFetch(trigger))
    } else {
      clear()
    }
  }

  function keyupEventHandler(event: KeyboardEvent): void {
    const keyCode = event.which || event.keyCode || 0

    const ignore = [
      Keys.Up,
      Keys.Enter,
      Keys.Esc,
      Keys.Right,
      Keys.Left,
      Keys.Shift,
      Keys.Ctrl,
      Keys.Alt,
      Keys.CapsLock,
      Keys.WindowsKey,
      Keys.Tab,
    ]
    if (ignore.includes(keyCode)) {
      return
    }

    // the down key is used to open autocomplete
    if (keyCode === Keys.Down && containerDisplayed()) {
      return
    }

    startFetch(EventTrigger.Keyboard)
  }

  /**
   * Select the previous item in suggestions
   */
  function selectPreviousItem(): void {
    const items = getItems()
    const selected = getSelected()
    if (items.length === 0) {
      setSelected(undefined)
      return
    }
    if (selected === undefined || selected === items[0]) {
      setSelected(items[items.length - 1])
      return
    }
    for (let index = items.length - 1; index > 0; index -= 1) {
      if (selected === items[index] || index === 1) {
        setSelected(items[index - 1])
        return
      }
    }
  }

  /**
   * Select the next item in suggestions
   */
  function selectNextItem(): void {
    const items = getItems()
    const selected = getSelected()
    if (items.length === 0) {
      setSelected(undefined)
      return
    }
    if (selected === undefined || selected === items[items.length - 1]) {
      // eslint-disable-next-line prefer-destructuring
      setSelected(items[0])
      return
    }
    for (let index = 0; index < items.length - 1; index += 1) {
      if (selected === items[index]) {
        setSelected(items[index + 1])
        return
      }
    }
  }

  function handleArrowKeysDown(arrowKey: Keys.Up | Keys.Down) {
    const containerIsDisplayed = containerDisplayed()
    if (containerIsDisplayed && getItems().length > 0) {
      switch (arrowKey) {
        case Keys.Up:
          selectPreviousItem()
          break
        case Keys.Down:
          selectNextItem()
          break
        default:
      }
      update()
    }
  }

  function handleSelectKeysDown(event: KeyboardEvent) {
    const selected = getSelected()
    if (strict) {
      settings.onSelect(selected, input, event)
    } else {
      const freeTextSelect = { label: input.value } as T
      if (selected) {
        settings.onSelect(selected, input, event)
        return
      }
      if (onFreeTextSelect) {
        onFreeTextSelect(freeTextSelect, input)
      }
      settings.onSelect(freeTextSelect, input, event)
    }
    clear()
  }

  function keydownEventHandler(event: KeyboardEvent): void {
    const keyCode = event.which || event.keyCode || 0

    if (
      keyCode === Keys.Up ||
      keyCode === Keys.Down ||
      keyCode === Keys.Esc ||
      keyCode === Keys.Enter ||
      keyCode === Keys.Tab
    ) {
      event.preventDefault()
      if (containerDisplayed()) {
        event.stopPropagation()
      }
      if (keyCode === Keys.Up || keyCode === Keys.Down || keyCode === Keys.Esc) {
        if (keyCode === Keys.Esc) {
          settings.onSelect(undefined, input, event)
          clear()
        } else {
          handleArrowKeysDown(keyCode)
        }
        return
      }

      if (keyCode === Keys.Enter || keyCode === Keys.Tab) {
        handleSelectKeysDown(event)
      }
    }
  }

  function focusEventHandler(): void {
    if (showOnFocus) {
      startFetch(EventTrigger.Focus)
    }
  }

  function focusOutEventHandler(event: Event): void {
    // we need to delay clear, because when we click on an item, blur will be called before click and remove items from DOM
    event.preventDefault()
    event.stopPropagation()
    setTimeout(() => {
      if (getDocument().activeElement !== input) {
        clear()
      }
    }, 200)
  }

  function removeEventListeners() {
    const document = getDocument()

    input.removeEventListener('focus', focusEventHandler)
    input.removeEventListener('keydown', keydownEventHandler)
    input.removeEventListener(KEYUP_EVENT_NAME, keyupEventHandler as EventListenerOrEventListenerObject)
    input.removeEventListener('focusout', focusOutEventHandler)
    document.removeEventListener('resize', resizeEventHandler)
    document.removeEventListener('scroll', scrollEventHandler, true)
  }

  function addEventListeners() {
    const document = getDocument()

    input.addEventListener('keydown', keydownEventHandler)
    input.addEventListener(KEYUP_EVENT_NAME, keyupEventHandler as EventListenerOrEventListenerObject)
    input.addEventListener('focusout', focusOutEventHandler)
    input.addEventListener('focus', focusEventHandler)
    document.addEventListener('resize', resizeEventHandler)
    document.addEventListener('scroll', scrollEventHandler, true)
  }

  /**
   * This function will remove DOM elements and clear event handlers
   */
  function destroy(): void {
    removeEventListeners()
    clearDebounceTimer()
    clear()

    // prevent the update call if there are pending AJAX requests
    incrementKeypressCounter()
  }

  addEventListeners()
  return {
    destroy,
  }
}
