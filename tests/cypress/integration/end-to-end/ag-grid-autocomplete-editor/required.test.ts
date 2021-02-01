import {AutocompleteSelectCellEditor} from 'ag-grid-autocomplete-editor';
import {ColDef, Grid} from 'ag-grid-community';


describe('ag-grid-autocomplete-editor end-to-end required option tests', () => {
    it('should not remove actual value by starting edit with delete', function () {
        cy.fixture('selectDatas/names.json').as('selectDatas');
        // @ts-ignore
        cy.visit('./static/ag-grid-autocomplete-editor-test-sandbox.html');
        cy.get('#myGrid')
            .then((jQueryElement) => {
                const rowDatas = [
                    {'autocomplete-column': null},
                    {'autocomplete-column': null},
                    {'autocomplete-column': null},
                    {'autocomplete-column': null},
                    {'autocomplete-column': null},
                ];
                const columnDefs: ColDef[] = [
                    {
                        headerName: "Already present data selector",
                        field: "autocomplete-column",
                        // @ts-ignore
                        cellEditor: AutocompleteSelectCellEditor,
                        cellEditorParams: {
                            selectData: this.selectDatas,
                            placeholder: 'Select an option',
                            required: true,
                        },
                        valueFormatter: (params) => {
                            if (params.value) {
                                return params.value.label || params.value.value || params.value;
                            }
                            return "";
                        },
                        editable: true,
                    }
                ];
                const gridOptions = {
                    columnDefs: columnDefs,
                    rowData: rowDatas,
                    suppressScrollOnNewData: false,
                    suppressBrowserResizeObserver: true,
                };
                new Grid(<HTMLElement>jQueryElement.get(0), gridOptions)
            });
        // ag-grid should be created on the DOM
        cy.get('.ag-root').should('exist');
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist');
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke');
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        // Should select the first element and hit enter it to select
        cy.get('.ag-row-first > .ag-cell ').type('{downArrow}').type('{enter}');
        // input should have been closed
        cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist');
        // Input should have been selected and sent to ag-grid
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
        cy.get('.ag-row-first > .ag-cell ').type('{del}').type('{enter}');
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
    });
    it('should keep last valid value if new value does not match any item', function () {
        cy.fixture('selectDatas/names.json').as('selectDatas');
        // @ts-ignore
        cy.visit('./static/ag-grid-autocomplete-editor-test-sandbox.html');
        cy.get('#myGrid')
            .then((jQueryElement) => {
                const rowDatas = [
                    {'autocomplete-column': null},
                    {'autocomplete-column': null},
                    {'autocomplete-column': null},
                    {'autocomplete-column': null},
                    {'autocomplete-column': null},
                ];
                const columnDefs: ColDef[] = [
                    {
                        headerName: "Already present data selector",
                        field: "autocomplete-column",
                        // @ts-ignore
                        cellEditor: AutocompleteSelectCellEditor,
                        cellEditorParams: {
                            selectData: this.selectDatas,
                            placeholder: 'Select an option',
                            required: true,
                        },
                        valueFormatter: (params) => {
                            if (params.value) {
                                return params.value.label || params.value.value || params.value;
                            }
                            return "";
                        },
                        editable: true,
                    }
                ];
                const gridOptions = {
                    columnDefs: columnDefs,
                    rowData: rowDatas,
                    suppressScrollOnNewData: false,
                    suppressBrowserResizeObserver: true,
                };
                new Grid(<HTMLElement>jQueryElement.get(0), gridOptions)
            });
        // ag-grid should be created on the DOM
        cy.get('.ag-root').should('exist');
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist');
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke');
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        // Should select the first element and hit enter it to select
        cy.get('.ag-row-first > .ag-cell ').type('{downArrow}').type('{enter}');
        // input should have been closed
        cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist');
        // Input should have been selected and sent to ag-grid
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
        cy.get('.ag-row-first > .ag-cell ').type('{del}').type('not a valid name').type('{enter}');
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
    });
    it('should keep last valid value if isCancelBeforeEnd called', function () {
        cy.fixture('selectDatas/names.json').as('selectDatas');
        // @ts-ignore
        cy.visit('./static/ag-grid-autocomplete-editor-test-sandbox.html');
        cy.get('#myGrid')
            .then((jQueryElement) => {
                const rowDatas = [
                    {'autocomplete-column': null},
                    {'autocomplete-column': null},
                    {'autocomplete-column': null},
                    {'autocomplete-column': null},
                    {'autocomplete-column': null},
                ];
                const columnDefs: ColDef[] = [
                    {
                        headerName: "Already present data selector",
                        field: "autocomplete-column",
                        // @ts-ignore
                        cellEditor: AutocompleteSelectCellEditor,
                        cellEditorParams: {
                            selectData: this.selectDatas,
                            placeholder: 'Select an option',
                            required: true,
                        },
                        valueFormatter: (params) => {
                            if (params.value) {
                                return params.value.label || params.value.value || params.value;
                            }
                            return "";
                        },
                        editable: true,
                    }
                ];
                const gridOptions = {
                    columnDefs: columnDefs,
                    rowData: rowDatas,
                    suppressScrollOnNewData: false,
                    suppressBrowserResizeObserver: true,
                };
                new Grid(<HTMLElement>jQueryElement.get(0), gridOptions)
            });
        // ag-grid should be created on the DOM
        cy.get('.ag-root').should('exist');
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist');
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke');
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        // Should select the first element and hit enter it to select
        cy.get('.ag-row-first > .ag-cell ').type('{downArrow}').type('{enter}');
        // input should have been closed
        cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist');
        // Input should have been selected and sent to ag-grid
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
        cy.get('.ag-row-first > .ag-cell ').type('{enter}');
        cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('exist');
        cy.get('.ag-row-first > .ag-cell ').type('{esc}');
        cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist');
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
    });
});
