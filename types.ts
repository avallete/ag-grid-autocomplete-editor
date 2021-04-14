import { ICellEditorParams, PopupComponent } from '@ag-grid-community/core'

import { AutocompleteItem, EventTrigger } from './autocompleter/types'

export interface DataFormat extends AutocompleteItem {
  value: number | string
  label: string
  group?: string
}

export type AutocompleteClient = DataFormat & AutocompleteItem

export interface IDefaultAutocompleterSettings<T extends AutocompleteItem, U extends PopupComponent> {
  render: (cellEditor: U, item: T, currentValue: string) => HTMLElement
  renderGroup: (cellEditor: U, name: string, currentValue: string) => HTMLElement
  className: string
  minLength: number
  emptyMsg: string
  strict: boolean
  autoselectfirst: boolean
  onFreeTextSelect: (cellEditor: U, item: T, input: HTMLInputElement) => void
  onSelect: (cellEditor: U, item: T | undefined, input: HTMLInputElement) => void
  fetch: (cellEditor: U, text: string, update: (items: T[] | false) => void, trigger?: EventTrigger) => void
  debounceWaitMs: number
  showOnFocus: boolean
  customize: (
    cellEditor: U,
    input: HTMLInputElement,
    inputRect: ClientRect | DOMRect,
    container: HTMLDivElement,
    maxHeight: number
  ) => void
}

export interface IAutocompleterSettings<T extends AutocompleteItem, U extends PopupComponent> {
  render?: (cellEditor: U, item: T, currentValue: string) => HTMLElement
  renderGroup?: (cellEditor: U, name: string, currentValue: string) => HTMLElement
  className?: string
  minLength?: number
  emptyMsg?: string
  strict?: boolean
  autoselectfirst?: boolean
  onFreeTextSelect?: (cellEditor: U, item: T, input: HTMLInputElement) => void
  onSelect?: (cellEditor: U, item: T | undefined, input: HTMLInputElement) => void
  fetch?: (cellEditor: U, text: string, update: (items: T[] | false) => void, trigger?: EventTrigger) => void
  debounceWaitMs?: number
  customize?: (
    cellEditor: U,
    input: HTMLInputElement,
    inputRect: ClientRect | DOMRect,
    container: HTMLDivElement,
    maxHeight: number
  ) => void
}

export interface IAutocompleteSelectCellEditorParameters<U extends PopupComponent> extends ICellEditorParams {
  autocomplete?: IAutocompleterSettings<DataFormat, U>
  selectData: Array<DataFormat> | ((parameters: IAutocompleteSelectCellEditorParameters<U>) => Array<DataFormat>)
  placeholder?: string
  required?: boolean
}
