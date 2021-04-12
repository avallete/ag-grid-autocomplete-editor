import { AutocompleteItem, RenderFunction, RenderGroupFunction } from './types';
export declare function removeChildren(container: Node): void;
export declare function defaultRenderGroup(groupName: string): HTMLDivElement;
export declare function defaultRender(item: AutocompleteItem): HTMLDivElement;
export declare function renderItems<T extends AutocompleteItem>(items: T[], selected: T | undefined, inputValue: string, render: RenderFunction<T>, renderGroup: RenderGroupFunction, clickHandler: (item: T, event: MouseEvent) => void): DocumentFragment;
