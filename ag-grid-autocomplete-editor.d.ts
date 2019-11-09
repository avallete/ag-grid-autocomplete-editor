import { IAfterGuiAttachedParams, ICellEditorComp, ICellEditorParams, PopupComponent } from 'ag-grid-community';
import './ag-grid-autocomplete-editor.scss';
import { AutocompleteItem, EventTrigger } from './autocompleter/autocomplete';
export interface DataFormat extends AutocompleteItem {
    value: number | string;
    label: string;
    group?: string;
}
export declare type AutocompleteClient = DataFormat & AutocompleteItem;
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
export declare class AutocompleteSelectCellEditor extends PopupComponent implements ICellEditorComp {
    currentItem?: DataFormat;
    private focusAfterAttached;
    private readonly eInput;
    private autocompleter?;
    private required;
    private stopEditing?;
    private gridOptionsWrapper?;
    constructor();
    private static suppressKeyboardEvent;
    private static getStartValue;
    init(params: IAutocompleteSelectCellEditorParams): void;
    handleTabEvent(event: KeyboardEvent): void;
    afterGuiAttached(params?: IAfterGuiAttachedParams): void;
    focusIn(): void;
    focusOut(): void;
    destroy(): void;
    getValue(): DataFormat | undefined;
    isCancelAfterEnd(): boolean;
    isCancelBeforeStart(): boolean;
    isPopup(): boolean;
    getSelectData(params: IAutocompleteSelectCellEditorParams): Array<DataFormat>;
}
