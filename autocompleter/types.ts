export const enum EventTrigger {
  Keyboard = 0,
  Focus = 1,
}

export interface AutocompleteItem {
  label?: string
  group?: string
}

export type RenderFunction<T extends AutocompleteItem> = (item: T, currentValue: string) => HTMLElement
export type RenderGroupFunction = (groupName: string, currentValue: string) => HTMLElement
