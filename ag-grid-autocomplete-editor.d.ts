import { AutocompleteItem } from "autocompleter";
import { IAfterGuiAttachedParams, ICellEditorComp, ICellEditorParams, PopupComponent } from "ag-grid-community";
import './ag-grid-autocomplete-editor.scss';
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
    onSelect?: (cellEditor: AutocompleteSelectCellEditor, item: T, input: HTMLInputElement) => void;
    fetch?: (cellEditor: AutocompleteSelectCellEditor, text: string, update: (items: T[] | false) => void) => void;
    debounceWaitMs?: number;
    customize?: (cellEditor: AutocompleteSelectCellEditor, input: HTMLInputElement, inputRect: ClientRect | DOMRect, container: HTMLDivElement, maxHeight: number) => void;
}
export interface IAutocompleteSelectCellEditorParams extends ICellEditorParams {
    autocomplete?: IAutocompleterSettings<AutocompleteClient>;
    data?: DataFormat[];
    placeholder?: string;
}
export declare class AutocompleteSelectCellEditor extends PopupComponent implements ICellEditorComp {
    private focusAfterAttached;
    private readonly eInput;
    private currentItem?;
    private autocompleter?;
    private gridOptionsWrapper?;
    constructor();
    private static getStartValue;
    init(params: IAutocompleteSelectCellEditorParams): void;
    afterGuiAttached(params?: IAfterGuiAttachedParams): void;
    focusIn(): void;
    focusOut(): void;
    getValue(): DataFormat;
    isCancelAfterEnd(): boolean;
    isCancelBeforeStart(): boolean;
    isPopup(): boolean;
}
