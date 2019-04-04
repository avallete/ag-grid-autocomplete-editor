import {AutocompleteItem} from "autocompleter";
import {Constants, GridOptionsWrapper, Autowired, IAfterGuiAttachedParams, ICellEditorComp, ICellEditorParams, PopupComponent, SuppressKeyboardEventParams} from "ag-grid-community";

import './ag-grid-autocomplete-editor.scss';
// This import must be done with require because of TypeScript transpiler problems with export default
const autocomplete = require("autocompleter");

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
    onSelect: (cellEditor: AutocompleteSelectCellEditor, item: T, input: HTMLInputElement) => void;
    fetch: (cellEditor: AutocompleteSelectCellEditor, text: string, update: (items: T[] | false) => void) => void;
    debounceWaitMs: number;
    customize: (cellEditor: AutocompleteSelectCellEditor, input: HTMLInputElement, inputRect: ClientRect | DOMRect, container: HTMLDivElement, maxHeight: number) => void;
}

export interface IAutocompleterSettings<T extends AutocompleteItem> {
    render?: (cellEditor: AutocompleteSelectCellEditor, item: T, currentValue: string) => HTMLDivElement | undefined;
    renderGroup?: (cellEditor: AutocompleteSelectCellEditor, name: string, currentValue: string) => HTMLDivElement | undefined;
    className?: string;
    minLength?: number;
    emptyMsg?: string;
    onSelect?: (cellEditor: AutocompleteSelectCellEditor, item: T, input: HTMLInputElement) => void;
    fetch?: (cellEditor: AutocompleteSelectCellEditor, text: string, update: (items: T[] | false) => void) => void;
    debounceWaitMs?: number;
    customize?: (cellEditor: AutocompleteSelectCellEditor, input: HTMLInputElement, inputRect: ClientRect | DOMRect, container: HTMLDivElement, maxHeight: number) => void;
}

export interface IAutocompleteSelectCellEditorParams extends ICellEditorParams {
    autocomplete?: IAutocompleterSettings<AutocompleteClient>,
    data: DataFormat[],
    placeholder?: string
}

export class AutocompleteSelectCellEditor extends PopupComponent implements ICellEditorComp {
    private focusAfterAttached: boolean = false;
    private readonly eInput: HTMLInputElement;
    private currentItem?: DataFormat;
    private autocompleter?: any;

    @Autowired('gridOptionsWrapper') private gridOptionsWrapper?: GridOptionsWrapper;

    constructor() {
        super('<div class="ag-cell-edit-input" style="padding: 0 !important;"><input class="ag-cell-edit-input" type="text"/></div>');
        this.eInput = this.getGui().querySelector('input') as HTMLInputElement;
        if (this.currentItem) {
            this.eInput.value = this.currentItem.label || this.currentItem.value as string;
        }
    }
    private static suppressKeyboardEvent(params: SuppressKeyboardEventParams): boolean {
        let keyCode = params.event.keyCode;
        let gridShouldDoNothing = params.editing && (keyCode === Constants.KEY_UP || keyCode === Constants.KEY_DOWN || keyCode === Constants.KEY_ENTER);
        return gridShouldDoNothing;
    }

    private static getStartValue(params: IAutocompleteSelectCellEditorParams) {
        const keyPressBackspaceOrDelete = params.keyPress === Constants.KEY_BACKSPACE || params.keyPress === Constants.KEY_DELETE;
        if (keyPressBackspaceOrDelete) {
            return '';
        } else if (params.charPress) {
            return params.charPress;
        }
        return params.formatValue(params.value);
    }

    public init(params: IAutocompleteSelectCellEditorParams) {
        const defaultSettings: IDefaultAutocompleterSettings<AutocompleteClient> = {
            render: function (cellEditor, item: AutocompleteClient, value) {
                let itemElement = document.createElement("div");
                let regex = new RegExp(value, 'gi');
                let fieldItem = document.createElement('span');
                fieldItem.innerHTML = item.label.replace(regex, function (match) {
                    return "<strong>" + match + "</strong>"
                });
                itemElement.append(fieldItem);
                cellEditor.addDestroyableEventListener(itemElement, 'mousedown', (event: MouseEvent) => {
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
            onSelect: function (cellEditor, item: AutocompleteClient) {
                cellEditor.currentItem = item;
            },
            fetch: function (cellEditor, text, callback) {
                let items = params.data || [];
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

        const autocompleteParams = params.autocomplete || {};

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
            minLength: autocompleteParams.minLength || defaultSettings.minLength,
            emptyMsg: autocompleteParams.emptyMsg || defaultSettings.emptyMsg,
            onSelect: (item: AutocompleteClient, input: HTMLInputElement) => {
                if (autocompleteParams.onSelect) {
                    return autocompleteParams.onSelect(this, item, input);
                }
                return defaultSettings.onSelect(this, item, input);
            },
            fetch: (text: string, update: (items: AutocompleteClient[] | false) => void) => {
                if (autocompleteParams.fetch) {
                    return autocompleteParams.fetch(this, text, update)
                }
                return defaultSettings.fetch(this, text, update);
            },
            debounceWaitMs: autocompleteParams.debounceWaitMs || defaultSettings.debounceWaitMs,
            customize: (input: HTMLInputElement, inputRect: ClientRect | DOMRect, container: HTMLDivElement, maxHeight: number) => {
                if (autocompleteParams.customize) {
                    return autocompleteParams.customize(this, input, inputRect, container, maxHeight);
                }
                return defaultSettings.customize(this, input, inputRect, container, maxHeight);
            }
        });

        // we don't want to add this if full row editing, otherwise selecting will stop the
        // full row editing.
        if (this.gridOptionsWrapper && !this.gridOptionsWrapper.isFullRowEdit()) {
            this.addDestroyableEventListener(this.eInput, 'change', () => params.stopEditing());
        }
        if (!params.colDef.suppressKeyboardEvent) {
            params.colDef.suppressKeyboardEvent = AutocompleteSelectCellEditor.suppressKeyboardEvent;
        }
    }

    afterGuiAttached(params?: IAfterGuiAttachedParams): void {
        if (this.focusAfterAttached) {
            this.eInput.focus();
        }
    }

    focusIn(): void {
        this.eInput.focus()
    }

    focusOut(): void {
        this.eInput.blur();
        this.autocompleter.destroy();
    }

    getValue(): DataFormat {
        return this.currentItem || {value: '', label: ''};
    }

    isCancelAfterEnd(): boolean {
        return !this.currentItem;
    }

    isCancelBeforeStart(): boolean {
        return false;
    }

    isPopup(): boolean {
        return false;
    }
}
