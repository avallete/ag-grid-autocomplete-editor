import {AutocompleteSelectCellEditor} from 'ag-grid-autocomplete-editor';
import {ColDef, Grid} from 'ag-grid-community';


describe('ag-grid-autocomplete-editor end-to-end basic tests', () => {
    it('should create an ag-grid with some AutocompleteSelectCellEditor without crash', function () {
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
        // ag-grid should have rows and cells created as well
        cy.get('.ag-row-first ').should('exist');
        cy.get('[row-index="3"]').should('exist');
        cy.get('[row-index="3"] > .ag-cell').should('exist');
    });
    it('should create and enter edit mode with AutocompleteSelectCellEditor when cell double clicked', function () {
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
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').dblclick();
        // should have created the input text
        cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').should('exist');
        cy.get('*[placeholder="Select an option"]').should('exist');
    });
    it('should create and enter edit mode with AutocompleteSelectCellEditor when cell clicked then Enter pressed', function () {
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
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').click().type('{enter}');
        // should have created the input text
        cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').should('exist');
        cy.get('*[placeholder="Select an option"]').should('exist');
    });
    it('should not create if the cell is just single clicked', function () {
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
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').click();
        // should have created the input text
        cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').should('not.exist');
        cy.get('*[placeholder="Select an option"]').should('not.exist');
    });
    it('should close opened input when Enter hit', function () {
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
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').click().type('{enter}');
        // should have created the input text
        cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').should('exist');
        cy.get('*[placeholder="Select an option"]').should('exist');
        // Close the input
        cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').type('{enter}');
        // input should have been closed
        cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').should('not.exist');
        cy.get('*[placeholder="Select an option"]').should('not.exist');
    });
    // TODO error due to Cypress reported to https://github.com/cypress-io/cypress/issues/5650
    // it('should close current and go to the next input when Tab hit', function () {
    //     cy.fixture('selectDatas/names.json').as('selectDatas');
    //     // @ts-ignore
    //     cy.visit('./static/ag-grid-autocomplete-editor-test-sandbox.html');
    //     cy.get('#myGrid')
    //         .then((jQueryElement) => {
    //             const rowDatas = [
    //                 {'autocomplete-column': null, 'coltwo': ''},
    //                 {'autocomplete-column': null, 'coltwo': ''},
    //                 {'autocomplete-column': null, 'coltwo': ''},
    //                 {'autocomplete-column': null, 'coltwo': ''},
    //                 {'autocomplete-column': null, 'coltwo': ''},
    //             ];
    //             const columnDefs: ColDef[] = [
    //                 {
    //                     headerName: "Already present data selector",
    //                     field: "autocomplete-column",
    //                     // @ts-ignore
    //                     cellEditor: AutocompleteSelectCellEditor,
    //                     cellEditorParams: {
    //                         selectData: this.selectDatas,
    //                         placeholder: 'Select an option',
    //                     },
    //                     valueFormatter: (params) => {
    //                         if (params.value) {
    //                             return params.value.label || params.value.value || params.value;
    //                         }
    //                         return "";
    //                     },
    //                     editable: true,
    //                 },
    //                 {
    //                     headerName: "ColTwo",
    //                     field: "coltwo",
    //                     editable: true,
    //                 },
    //             ];
    //             const gridOptions = {
    //                 columnDefs: columnDefs,
    //                 rowData: rowDatas,
    //                 suppressScrollOnNewData: false,
    //             };
    //             new Grid(<HTMLElement>jQueryElement.get(0), gridOptions)
    //         });
    //     // ag-grid should be created on the DOM
    //     cy.get('.ag-root').should('exist');
    //     // Start the edition
    //     cy.get('[row-index="0"] > [col-id="autocomplete-column"]').click().type('{enter}').type('toto').type('{enter}');
    //     // should have created the input text
    //     cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').should('exist');
    //     cy.get('*[placeholder="Select an option"]').should('exist');
    //     // Close the input
    //     cy.get('[row-index="0"] > [col-id="autocomplete-column"]')
    //         .trigger('keydown', {
    //             keyCode: 9,
    //             which: 9,
    //             shiftKey: false,
    //             ctrlKey: false
    //         });
    //     // input should have been closed
    //     cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').should('not.exist');
    //     cy.get('*[placeholder="Select an option"]').should('not.exist');
    // });
    it('should close opened input when Tab hit', function () {
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
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').click().type('{enter}');
        // should have created the input text
        cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').should('exist');
        cy.get('*[placeholder="Select an option"]').should('exist');
        // Close the input
        cy.get('div.ag-cell-edit-input > .ag-cell-edit-input')
            .trigger('keydown', {
                keyCode: 9,
                which: 9,
                shiftKey: false,
                ctrlKey: false
            });
        // input should have been closed
        cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').should('not.exist');
        cy.get('*[placeholder="Select an option"]').should('not.exist');
    });
    it('should show selection list when some text is typed in search', function () {
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
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').click().type('{enter}').type('Ke');
        // Should have created the autocomplete selection box
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        // Should have two elements matching Ke coming from the data
        cy.get('.autocomplete.ag-cell-editor-autocomplete').find('div').should('have.length', 2)
    });
    it('should select autocomplete the data and put it into ag-grid when clicked 1st', function () {
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
        cy.get('.ag-row-first > .ag-cell ').contains('Kelley Santana').should('not.exist');
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').click().type('{enter}').type('Ke');
        // Should select the first element and click it to select
        cy.get('.autocomplete.ag-cell-editor-autocomplete > div:eq(0)').click();
        // input should have been closed
        cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').should('not.exist');
        // Input should have been selected and sent to ag-grid
        cy.get('.ag-row-first > .ag-cell ').contains('Kelley Santana').should('exist');
    });
    it('should select autocomplete the data and put it into ag-grid when clicked 2nd', function () {
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
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist');
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').click().type('{enter}').type('Ke');
        // Should select the second element and click it to select
        cy.get('.autocomplete.ag-cell-editor-autocomplete > div:eq(1)').click();
        // input should have been closed
        cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').should('not.exist');
        // Input should have been selected and sent to ag-grid
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
    });
    it('should select autocomplete the data and put it into ag-grid when Enter hit 1st', function () {
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
        cy.get('.ag-row-first > .ag-cell ').contains('Kelley Santana').should('not.exist');
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke');
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        // Should select the first element and hit enter it to select
        cy.get('.ag-row-first > .ag-cell ').type('{enter}');
        // input should have been closed
        cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').should('not.exist');
        // Input should have been selected and sent to ag-grid
        cy.get('.ag-row-first > .ag-cell ').contains('Kelley Santana').should('exist');
    });
    it('should select autocomplete the data and put it into ag-grid when Enter hit 2nd', function () {
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
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist');
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke');
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        // Should select the first element and hit enter it to select
        cy.get('.ag-row-first > .ag-cell ').type('{downArrow}').type('{enter}');
        // input should have been closed
        cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').should('not.exist');
        // Input should have been selected and sent to ag-grid
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
    });
    it('should remove actual value by starting edit with delete', function () {
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
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist');
        // Start the edition
        cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke');
        cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist');
        // Should select the first element and hit enter it to select
        cy.get('.ag-row-first > .ag-cell ').type('{downArrow}').type('{enter}');
        // input should have been closed
        cy.get('div.ag-cell-edit-input > .ag-cell-edit-input').should('not.exist');
        // Input should have been selected and sent to ag-grid
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist');
        cy.get('.ag-row-first > .ag-cell ').type('{del}').type('{enter}');
        cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist');
    });
});
