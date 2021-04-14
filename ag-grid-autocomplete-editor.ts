import { ICellEditorComp, PopupComponent, SuppressKeyboardEventParams } from '@ag-grid-community/core'

import { IAutocompleteSelectCellEditorParameters, IDefaultAutocompleterSettings, DataFormat } from './types'

import autocomplete from './autocompleter/autocomplete'

import './ag-grid-autocomplete-editor.scss'

const KEY_BACKSPACE = 8
const KEY_DELETE = 46
const KEY_ENTER = 13
const KEY_TAB = 9
const KEY_UP = 38
const KEY_DOWN = 40

const KeysHandled = new Set([KEY_BACKSPACE, KEY_DELETE, KEY_ENTER, KEY_TAB, KEY_UP, KEY_DOWN])

export default class AutocompleteSelectCellEditor extends PopupComponent implements ICellEditorComp {
  public currentItem?: DataFormat

  private focusAfterAttached: boolean = false

  private readonly eInput: HTMLInputElement

  private autocompleter?: any

  private required: boolean = false

  private stopEditing?: (cancel?: boolean) => void

  constructor() {
    super(
      '<div class="ag-wrapper ag-input-wrapper ag-text-field-input-wrapper ag-cell-editor-autocomplete-wrapper" style="padding: 0 !important;"><input class="ag-input-field-input ag-text-field-input ag-cell-editor-autocomplete-input" type="text"/></div>'
    )
    this.eInput = this.getGui().querySelector('input') as HTMLInputElement
    if (this.currentItem) {
      this.eInput.value = this.currentItem.label || (this.currentItem.value as string)
    }
  }

  private static suppressKeyboardEvent(parameters: SuppressKeyboardEventParams): boolean {
    const { keyCode } = parameters.event
    return parameters.editing && KeysHandled.has(keyCode)
  }

  private static getStartValue(parameters: IAutocompleteSelectCellEditorParameters<AutocompleteSelectCellEditor>) {
    const keyPressBackspaceOrDelete = parameters.keyPress === KEY_BACKSPACE || parameters.keyPress === KEY_DELETE
    if (keyPressBackspaceOrDelete) {
      return ''
    }
    if (parameters.charPress) {
      return parameters.charPress
    }
    return parameters.formatValue(parameters.value)
  }

  public init(parameters: IAutocompleteSelectCellEditorParameters<AutocompleteSelectCellEditor>) {
    this.stopEditing = parameters.stopEditing
    const defaultSettings: IDefaultAutocompleterSettings<DataFormat, this> = {
      showOnFocus: false,
      render(cellEditor, item, value) {
        const itemElement = document.createElement('div')
        const escapedValue = (value ?? '').replace(/[$()*+.?[\\\]^{|}]/g, '\\$&')
        const regex = new RegExp(escapedValue, 'gi')
        const fieldItem = document.createElement('span')
        fieldItem.innerHTML = item.label.replace(regex, function strongify(match: string) {
          return `<strong>${match}</strong>`
        })
        itemElement.append(fieldItem)
        cellEditor.addManagedListener(itemElement, 'mousedown', (event: MouseEvent) => {
          cellEditor.currentItem = item
          event.stopPropagation()
        })
        return itemElement
      },
      renderGroup(cellEditor, name) {
        const div = document.createElement('div')
        div.textContent = name
        div.className = 'group'
        return div
      },
      className: 'ag-cell-editor-autocomplete',
      minLength: 1,
      emptyMsg: 'None',
      strict: true,
      autoselectfirst: true,
      onFreeTextSelect() {},
      onSelect(cellEditor, item: DataFormat | undefined) {
        // eslint-disable-next-line no-param-reassign
        cellEditor.currentItem = item
      },
      fetch: (cellEditor, text, callback) => {
        const items = this.getSelectData(parameters)
        const match = text.toLowerCase() || cellEditor.eInput.value.toLowerCase()
        callback(
          items.filter(function (n) {
            return n.label.toLowerCase().includes(match)
          })
        )
      },
      debounceWaitMs: 200,
      customize(cellEditor, input, inputRect, container, maxHeight) {
        if (maxHeight < 100) {
          /* eslint-disable no-param-reassign */
          container.style.top = '10px'
          container.style.bottom = `${window.innerHeight - inputRect.bottom + input.offsetHeight}px`
          container.style.maxHeight = '140px'
          /* eslint-enable no-param-reassign */
        }
      },
    }
    this.focusAfterAttached = parameters.cellStartedEdit

    this.eInput.placeholder = parameters.placeholder || ''
    this.eInput.value = AutocompleteSelectCellEditor.getStartValue(parameters)

    const autocompleteParameters = { ...defaultSettings, ...parameters.autocomplete }

    this.autocompleter = autocomplete<DataFormat>({
      input: this.eInput,
      render: (item: DataFormat, currentValue: string) => {
        if (autocompleteParameters.render) {
          return autocompleteParameters.render(this, item, currentValue)
        }
        return defaultSettings.render(this, item, currentValue)
      },
      renderGroup: (name: string, currentValue: string) => {
        if (autocompleteParameters.renderGroup) {
          return autocompleteParameters.renderGroup(this, name, currentValue)
        }
        return defaultSettings.renderGroup(this, name, currentValue)
      },
      className: autocompleteParameters.className || defaultSettings.className,
      minLength:
        autocompleteParameters.minLength !== undefined ? autocompleteParameters.minLength : defaultSettings.minLength,
      emptyMsg: autocompleteParameters.emptyMsg || defaultSettings.emptyMsg,
      strict: autocompleteParameters.strict,
      autoselectfirst: autocompleteParameters.autoselectfirst,
      showOnFocus: autocompleteParameters.showOnFocus,
      onFreeTextSelect: (item: DataFormat, input: HTMLInputElement) => {
        if (autocompleteParameters.onFreeTextSelect) {
          return autocompleteParameters.onFreeTextSelect(this, item, input)
        }
        return defaultSettings.onFreeTextSelect(this, item, input)
      },
      onSelect: (item: DataFormat | undefined, input: HTMLInputElement, event: KeyboardEvent | MouseEvent) => {
        let result: any
        if (autocompleteParameters.onSelect) {
          result = autocompleteParameters.onSelect(this, item, input)
          // need the second argument because of cypress testing changing the view context
          if (event instanceof KeyboardEvent || event instanceof event.view!.document.defaultView!.KeyboardEvent) {
            this.handleTabEvent(event)
          } else {
            this.destroy()
          }
          return result
        }
        result = defaultSettings.onSelect(this, item, input)
        // need the second argument because of cypress testing changing the view context
        if (event instanceof KeyboardEvent || event instanceof event.view!.document.defaultView!.KeyboardEvent) {
          this.handleTabEvent(event)
        } else {
          this.destroy()
        }
        return result
      },
      fetch: (text: string, update: (items: DataFormat[] | false) => void, trigger) => {
        if (autocompleteParameters.fetch) {
          return autocompleteParameters.fetch(this, text, update, trigger)
        }
        return defaultSettings.fetch(this, text, update, trigger)
      },
      debounceWaitMs: autocompleteParameters.debounceWaitMs || defaultSettings.debounceWaitMs,
      customize: (
        input: HTMLInputElement,
        inputRect: ClientRect | DOMRect,
        container: HTMLDivElement,
        maxHeight: number
      ) => {
        if (autocompleteParameters.customize) {
          return autocompleteParameters.customize(this, input, inputRect, container, maxHeight)
        }
        return defaultSettings.customize(this, input, inputRect, container, maxHeight)
      },
    })
    if (parameters.required) {
      this.required = true
    }
    if (!parameters.colDef.suppressKeyboardEvent) {
      // eslint-disable-next-line no-param-reassign
      parameters.colDef.suppressKeyboardEvent = AutocompleteSelectCellEditor.suppressKeyboardEvent
    }
  }

  handleTabEvent(event: KeyboardEvent) {
    const keyCode = event.which || event.keyCode || 0
    if (keyCode === KEY_TAB && this.gridOptionsWrapper) {
      if (event.shiftKey) {
        this.gridOptionsWrapper.getApi()!.tabToPreviousCell()
      } else {
        this.gridOptionsWrapper.getApi()!.tabToNextCell()
      }
    } else {
      this.destroy()
    }
  }

  afterGuiAttached(): void {
    if (!this.focusAfterAttached) {
      return
    }

    const { eInput } = this
    eInput.focus()
    eInput.select()
    // when we started editing, we want the caret at the end, not the start.
    // this comes into play in two scenarios: a) when user hits F2 and b)
    // when user hits a printable character, then on IE (and only IE) the caret
    // was placed after the first character, thus 'apply' would end up as 'pplea'
    const length = eInput.value ? eInput.value.length : 0
    if (length > 0) {
      eInput.setSelectionRange(length, length)
    }
  }

  focusIn(): void {
    this.eInput.focus()
    this.eInput.select()
  }

  focusOut(): void {
    this.eInput.blur()
    this.autocompleter.destroy()
  }

  destroy(): void {
    this.focusOut()
    if (this.stopEditing) {
      this.stopEditing()
    }
  }

  getValue(): DataFormat | undefined {
    return this.currentItem
  }

  isCancelAfterEnd(): boolean {
    if (this.required) {
      return !this.currentItem
    }
    return false
  }

  // eslint-disable-next-line class-methods-use-this
  isCancelBeforeStart(): boolean {
    return false
  }

  // eslint-disable-next-line class-methods-use-this
  isPopup(): boolean {
    return false
  }

  // eslint-disable-next-line class-methods-use-this
  getSelectData(parameters: IAutocompleteSelectCellEditorParameters<AutocompleteSelectCellEditor>): Array<DataFormat> {
    if (typeof parameters.selectData === 'function') {
      return parameters.selectData(parameters)
    }

    if (Array.isArray(parameters.selectData)) {
      return parameters.selectData as Array<DataFormat>
    }

    return []
  }
}

export { AutocompleteSelectCellEditor, DataFormat }
