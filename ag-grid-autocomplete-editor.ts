import {
    IAfterGuiAttachedParams,
    ICellEditorComp,
    ICellEditorParams,
    PopupComponent,
    SuppressKeyboardEventParams
} from 'ag-grid-community';

import './ag-grid-autocomplete-editor.scss';
// This import must be done with require because of TypeScript transpiler problems with export default
import autocomplete, {AutocompleteItem, EventTrigger} from './autocompleter/autocomplete';


const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;
const KEY_ENTER = 13;
const KEY_TAB = 9;
const KEY_UP = 38;
const KEY_DOWN = 40;

export interface DataFormat extends AutocompleteItem {
    value: number | string;
    label: string;
    group?: string;
}

export type AutocompleteClient = DataFormat & AutocompleteItem;

interface IDefaultAutocompleterSettings<T extends AutocompleteItem> {
    render: (cellEditor: AutocompleteSelectCellEditor, item: T, currentValue: string) => HTMLDivElement | undefined;
    renderGroup: (cellEditor: AutocompleteSelectCellEditor, name: string, currentValue: string) => HTMLDivElement | undefined;
    className: string;
    minLength: number;
    emptyMsg: string;
    strict: boolean;
    autoselectfirst: boolean;
    onFreeTextSelect: (cellEditor: AutocompleteSelectCellEditor, item: T, input: HTMLInputElement) => void;
    onSelect: (cellEditor: AutocompleteSelectCellEditor, item: T | undefined, input: HTMLInputElement) => void;
    fetch: (cellEditor: AutocompleteSelectCellEditor, text: string, update: (items: T[] | false) => void, trigger?: EventTrigger) => void;
    debounceWaitMs: number;
    showOnFocus: boolean;
    customize: (cellEditor: AutocompleteSelectCellEditor, input: HTMLInputElement, inputRect: ClientRect | DOMRect, container: HTMLDivElement, maxHeight: number) => void;
}

export interface IAutocompleterSettings<T extends AutocompleteItem> {
    render?: (cellEditor: AutocompleteSelectCellEditor, item: T, currentValue: string) => HTMLDivElement | undefined;
    renderGroup?: (cellEditor: AutocompleteSelectCellEditor, name: string, currentValue: string) => HTMLDivElement | undefined;
    className?: string;
    minLength?: number;
    emptyMsg?: string;
    strict?: boolean;
    autoselectfirst?: boolean;
    onFreeTextSelect?: (cellEditor: AutocompleteSelectCellEditor, item: T, input: HTMLInputElement) => void;
    onSelect?: (cellEditor: AutocompleteSelectCellEditor, item: T | undefined, input: HTMLInputElement) => void;
    fetch?: (cellEditor: AutocompleteSelectCellEditor, text: string, update: (items: T[] | false) => void, trigger?: EventTrigger) => void;
    debounceWaitMs?: number;
    customize?: (cellEditor: AutocompleteSelectCellEditor, input: HTMLInputElement, inputRect: ClientRect | DOMRect, container: HTMLDivElement, maxHeight: number) => void;
}

export interface IAutocompleteSelectCellEditorParams extends ICellEditorParams {
    autocomplete?: IAutocompleterSettings<AutocompleteClient>;
    selectData: Array<DataFormat> | ((params: IAutocompleteSelectCellEditorParams) => Array<DataFormat>);
    placeholder?: string;
    required?: boolean;
}

export class AutocompleteSelectCellEditor extends PopupComponent implements ICellEditorComp {
    public currentItem?: DataFormat;
    private focusAfterAttached: boolean = false;
    private readonly eInput: HTMLInputElement;
    private autocompleter?: any;
    private required: boolean = false;
    private stopEditing?: (cancel?: boolean) => void;

    constructor() {
        super('<div class="ag-wrapper ag-input-wrapper ag-text-field-input-wrapper ag-cell-editor-autocomplete-wrapper" style="padding: 0 !important;"><input class="ag-input-field-input ag-text-field-input ag-cell-editor-autocomplete-input" type="text"/></div>');
        this.eInput = this.getGui().querySelector('input') as HTMLInputElement;
        if (this.currentItem) {
            this.eInput.value = this.currentItem.label || this.currentItem.value as string;
        }
    }

    private static suppressKeyboardEvent(params: SuppressKeyboardEventParams): boolean {
        let keyCode = params.event.keyCode;
        return params.editing && (keyCode === KEY_UP || keyCode === KEY_DOWN || keyCode === KEY_ENTER || keyCode === KEY_TAB);
    }

    private static getStartValue(params: IAutocompleteSelectCellEditorParams) {
        const keyPressBackspaceOrDelete = params.keyPress === KEY_BACKSPACE || params.keyPress === KEY_DELETE;
        if (keyPressBackspaceOrDelete) {
            return '';
        } else if (params.charPress) {
            return params.charPress;
        }
        return params.formatValue(params.value);
    }

    public init(params: IAutocompleteSelectCellEditorParams) {
        this.stopEditing = params.stopEditing;
        const defaultSettings: IDefaultAutocompleterSettings<AutocompleteClient> = {
            showOnFocus: false,
            render: function (cellEditor: AutocompleteSelectCellEditor, item: AutocompleteClient, value) {
                let itemElement = document.createElement("div");
                let escapedValue = (value ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                let regex = new RegExp(escapedValue, 'gi');
                let fieldItem = document.createElement('span');
                fieldItem.innerHTML = item.label.replace(regex, function (match: string) {
                    return "<strong>" + match + "</strong>"
                });
                itemElement.appendChild(fieldItem);
                cellEditor.addManagedListener(itemElement, 'mousedown', (event: MouseEvent) => {
                    cellEditor.currentItem = item;
                    event.stopPropagation();
                });
                return itemElement;
            },
            renderGroup: function (cellEditor, name) {
                let div = document.createElement('div');
                div.textContent = name;
                div.className = "group";
                return div;
            },
            className: 'ag-cell-editor-autocomplete',
            minLength: 1,
            emptyMsg: "None",
            strict: true,
            autoselectfirst: true,
            onFreeTextSelect: function () {
            },
            onSelect: function (cellEditor, item: AutocompleteClient | undefined) {
                cellEditor.currentItem = item;
            },
            fetch: (cellEditor, text, callback) => {
                let items = this.getSelectData(params);
                let match = text.toLowerCase() || cellEditor.eInput.value.toLowerCase();
                callback(items.filter(function (n) {
                    return n.label.toLowerCase().indexOf(match) !== -1;
                }));
            },
            debounceWaitMs: 200,
            customize: function (cellEditor, input, inputRect, container, maxHeight) {
                if (maxHeight < 100) {
                    container.style.top = "10px";
                    container.style.bottom = (window.innerHeight - inputRect.bottom + input.offsetHeight) + "px";
                    container.style.maxHeight = "140px";
                }
            }
        };
        this.focusAfterAttached = params.cellStartedEdit;

        this.eInput.placeholder = params.placeholder || '';
        this.eInput.value = AutocompleteSelectCellEditor.getStartValue(params);

        const autocompleteParams = {...defaultSettings, ...params.autocomplete};

        this.autocompleter = autocomplete({
            input: this.eInput,
            render: (item: AutocompleteClient, currentValue: string) => {
                if (autocompleteParams.render) {
                    return autocompleteParams.render(this, item, currentValue);
                }
                return defaultSettings.render(this, item, currentValue);
            },
            renderGroup: (name: string, currentValue: string) => {
                if (autocompleteParams.renderGroup) {
                    return autocompleteParams.renderGroup(this, name, currentValue);
                }
                return defaultSettings.renderGroup(this, name, currentValue);
            },
            className: autocompleteParams.className || defaultSettings.className,
            minLength: autocompleteParams.minLength !== undefined ? autocompleteParams.minLength : defaultSettings.minLength,
            emptyMsg: autocompleteParams.emptyMsg || defaultSettings.emptyMsg,
            strict: autocompleteParams.strict,
            autoselectfirst: autocompleteParams.autoselectfirst,
            showOnFocus: autocompleteParams.showOnFocus,
            onFreeTextSelect: (item: AutocompleteClient, input: HTMLInputElement) => {
                if (autocompleteParams.onFreeTextSelect) {
                    return autocompleteParams.onFreeTextSelect(this, item, input);
                }
                return defaultSettings.onFreeTextSelect(this, item, input);
            },
            onSelect: (item: AutocompleteClient | undefined, input: HTMLInputElement, event: KeyboardEvent | MouseEvent) => {
                let result: any;
                if (autocompleteParams.onSelect) {
                    result = autocompleteParams.onSelect(this, item, input);
                    if (event instanceof KeyboardEvent) {
                        this.handleTabEvent(event);
                    } else {
                        this.destroy();
                    }
                    return result;
                }
                result = defaultSettings.onSelect(this, item, input);
                if (event instanceof KeyboardEvent) {
                    this.handleTabEvent(event);
                } else {
                    this.destroy();
                }
                return result;
            },
            fetch: (text: string, update: (items: AutocompleteClient[] | false) => void, trigger: EventTrigger) => {
                if (autocompleteParams.fetch) {
                    return autocompleteParams.fetch(this, text, update, trigger)
                }
                return defaultSettings.fetch(this, text, update, trigger);
            },
            debounceWaitMs: autocompleteParams.debounceWaitMs || defaultSettings.debounceWaitMs,
            customize: (input: HTMLInputElement, inputRect: ClientRect | DOMRect, container: HTMLDivElement, maxHeight: number) => {
                if (autocompleteParams.customize) {
                    return autocompleteParams.customize(this, input, inputRect, container, maxHeight);
                }
                return defaultSettings.customize(this, input, inputRect, container, maxHeight);
            }
        });
        if (params.required) {
            this.required = true;
        }
        if (!params.colDef.suppressKeyboardEvent) {
            params.colDef.suppressKeyboardEvent = AutocompleteSelectCellEditor.suppressKeyboardEvent;
        }
    }

    handleTabEvent(event: KeyboardEvent) {
        const keyCode = event.which || event.keyCode || 0;
        if (keyCode === KEY_TAB && this.gridOptionsWrapper) {
            if (event.shiftKey) {
                this.gridOptionsWrapper.getApi()!.tabToPreviousCell();
            } else {
                this.gridOptionsWrapper.getApi()!.tabToNextCell();
            }
        } else {
            this.destroy();
        }
    }

    afterGuiAttached(params?: IAfterGuiAttachedParams): void {
        if (!this.focusAfterAttached) {
            return;
        }

        const eInput = this.eInput;
        eInput.focus();
        eInput.select();
        // when we started editing, we want the caret at the end, not the start.
        // this comes into play in two scenarios: a) when user hits F2 and b)
        // when user hits a printable character, then on IE (and only IE) the caret
        // was placed after the first character, thus 'apply' would end up as 'pplea'
        const length = eInput.value ? eInput.value.length : 0;
        if (length > 0) {
            eInput.setSelectionRange(length, length);
        }
    }

    focusIn(): void {
        this.eInput.focus();
        this.eInput.select();
    }

    focusOut(): void {
        this.eInput.blur();
        this.autocompleter.destroy();
    }

    destroy(): void {
        this.focusOut();
        if (this.stopEditing) {
            this.stopEditing();
        }
    }

    getValue(): DataFormat | undefined {
        return this.currentItem;
    }

    isCancelAfterEnd(): boolean {
        if (this.required) {
            return !this.currentItem;
        }
        return false;
    }

    isCancelBeforeStart(): boolean {
        return false;
    }

    isPopup(): boolean {
        return false;
    }

    getSelectData(params: IAutocompleteSelectCellEditorParams): Array<DataFormat> {
        if (typeof params.selectData === 'function') {
            return params.selectData(params);
        }

        if (Array.isArray(params.selectData)) {
            return params.selectData as Array<DataFormat>;
        }

        return [];
    }
}
