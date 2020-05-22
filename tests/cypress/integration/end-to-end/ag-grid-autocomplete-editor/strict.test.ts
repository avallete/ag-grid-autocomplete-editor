import {AutocompleteSelectCellEditor} from 'ag-grid-autocomplete-editor';
import {ColDef, Grid} from 'ag-grid-community';


describe('ag-grid-autocomplete-editor end-to-end strict option tests', () => {
    it('should keep input when strict is false even if no match', function () {
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
                            autocomplete: {
                                strict: false,
                            }
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
                };
                new Grid(<HTMLElement>jQueryElement.get(0), gridOptions)
            });
        // ag-grid should be created on the DOM
        cy.get('.ag-root').should('exist');
        cy.get('.ag-row-first > .ag-cell ').contains('aTestInput').should('not.exist');
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('aTestInput');
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        cy.get('.ag-row-first > .ag-cell ').type('{enter}');
        // input should have been closed
        cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist');
        // Input should have been selected and sent to ag-grid
        cy.get('.ag-row-first > .ag-cell ').contains('aTestInput').should('exist');
    });
    it('should keep input when clicking outside when strict is false', function () {
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
                            autocomplete: {
                                strict: false,
                            }
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
                };
                new Grid(<HTMLElement>jQueryElement.get(0), gridOptions)
            });
        // ag-grid should be created on the DOM
        cy.get('.ag-root').should('exist');
        cy.get('.ag-row-first > .ag-cell ').contains('aTestInput').should('not.exist');
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('aTestInput');
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        cy.get('.ag-row-last > .ag-cell ').click();
        // input should have been closed
        cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist');
        // Input should have been selected and sent to ag-grid
        cy.get('.ag-row-first > .ag-cell ').contains('aTestInput').should('exist');
    });
    it('should be able to remove all input after valid input even with required if strict is false', function () {
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
                            autocomplete: {
                                strict: false,
                            }
                        },
                        valueFormatter: (params) => {
                            if (params.value) {
                                return params.value.label !== undefined ? params.value.label : params.value.value;
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
                };
                new Grid(<HTMLElement>jQueryElement.get(0), gridOptions)
            });
        // ag-grid should be created on the DOM
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist');
        cy.get('.ag-row-first > .ag-cell ').type('{enter}');
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke');
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        // Should select the first element and hit enter it to select
        cy.get('.ag-row-first > .ag-cell ').type('{downArrow}').type('{enter}');
        // input should have been closed
        cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist');
        // Input should have been selected and sent to ag-grid
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
        // Delete all previous input and validate
        cy.get('.ag-row-first > .ag-cell ').type('{del}').type('{enter}');
        cy.get('.ag-row-first > .ag-cell ').invoke('val').should('equal', '');
    });
    it('should validate the actual value even if esc is pressed if strict is false', function () {
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
                            autocomplete: {
                                strict: false,
                            }
                        },
                        valueFormatter: (params) => {
                            if (params.value) {
                                return params.value.label !== undefined ? params.value.label : params.value.value;
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
                };
                new Grid(<HTMLElement>jQueryElement.get(0), gridOptions)
            });
        // ag-grid should be created on the DOM
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist');
        cy.get('.ag-row-first > .ag-cell ').type('{enter}');
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke');
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        // Should select the first element and hit enter it to select
        cy.get('.ag-row-first > .ag-cell ').type('{downArrow}').type('{enter}');
        // input should have been closed
        cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist');
        // Input should have been selected and sent to ag-grid
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
        // Delete all previous input and validate
        cy.get('.ag-row-first > .ag-cell ')
            .type('{del}')
            .type('testsomevalue')
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        cy.get('.ag-row-first > .ag-cell ').type('{esc}');
        cy.get('.ag-row-first > .ag-cell ').contains('testsomevalue').should('exist');
    });
    it('should not validate the actual value when esc is pressed and strict is true', function () {
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
                                return params.value.label !== undefined ? params.value.label : params.value.value;
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
                };
                new Grid(<HTMLElement>jQueryElement.get(0), gridOptions)
            });
        // ag-grid should be created on the DOM
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist');
        cy.get('.ag-row-first > .ag-cell ').type('{enter}');
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke');
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        // Should select the first element and hit enter it to select
        cy.get('.ag-row-first > .ag-cell ').type('{downArrow}').type('{enter}');
        // input should have been closed
        cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist');
        // Input should have been selected and sent to ag-grid
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
        // Delete all previous input and validate
        cy.get('.ag-row-first > .ag-cell ')
            .type('{del}')
            .type('testsomevalue')
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        cy.get('.ag-row-first > .ag-cell ').type('{esc}');
        cy.get('.ag-row-first > .ag-cell ').contains('testsomevalue').should('not.exist');
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
    });
    it('should not validate existing value when esc is pressed and strict is true', function () {
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
                                return params.value.label !== undefined ? params.value.label : params.value.value;
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
                };
                new Grid(<HTMLElement>jQueryElement.get(0), gridOptions)
            });
        // ag-grid should be created on the DOM
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist');
        cy.get('.ag-row-first > .ag-cell ').type('{enter}');
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke');
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        // Should select the first element and hit enter it to select
        cy.get('.ag-row-first > .ag-cell ').type('{downArrow}').type('{enter}');
        // input should have been closed
        cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist');
        // Input should have been selected and sent to ag-grid
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
        // Delete all previous input and validate
        cy.get('.ag-row-first > .ag-cell ')
            .type('{del}')
            .type('Suarez')
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        cy.get('.ag-row-first > .ag-cell ').type('{esc}');
        cy.get('.ag-row-first > .ag-cell ').contains('Suarez Duffy').should('not.exist');
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
    });
});
