import { AutocompleteSelectCellEditor } from 'ag-grid-autocomplete-editor'
import { ColDef, Grid } from 'ag-grid-community'

describe('ag-grid-autocomplete-editor end-to-end groups option tests', () => {
  it('should render groups when the data is present', function () {
    cy.fixture('selectDatas/groups.json').as('selectDatas')
    // @ts-ignore
    cy.visit('./static/ag-grid-autocomplete-editor-test-sandbox.html')
    cy.get('#myGrid').then((indexQueryElement) => {
      const rowDatas = [
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
      ]
      const columnDefs: ColDef[] = [
        {
          headerName: 'Already present data selector',
          field: 'autocomplete-column',
          // @ts-ignore
          cellEditor: AutocompleteSelectCellEditor,
          cellEditorParams: {
            selectData: this.selectDatas,
            placeholder: 'Select an option',
            required: true,
          },
          valueFormatter: (parameters) => {
            if (parameters.value) {
              return parameters.value.label || parameters.value.value || parameters.value
            }
            return ''
          },
          editable: true,
        },
      ]
      const gridOptions = {
        columnDefs,
        rowData: rowDatas,
        suppressScrollOnNewData: false,
        suppressBrowserResizeObserver: true,
      }
      new Grid(<HTMLElement>indexQueryElement.get(0), gridOptions)
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should have groups rendered
    cy.get('.autocomplete > div.group').should('exist')
  })
  it('should render group multiples time in data order foreach group change', function () {
    cy.fixture('selectDatas/groups.json').as('selectDatas')
    // @ts-ignore
    cy.visit('./static/ag-grid-autocomplete-editor-test-sandbox.html')
    const dataToAdd = [
      {
        value: 11,
        label: "Keytra D'achanul",
        group: 'Female',
      },
      {
        value: 12,
        label: 'Kerry James',
        group: 'Male',
      },
    ]
    cy.get('#myGrid').then((indexQueryElement) => {
      const rowDatas = [
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
      ]
      const columnDefs: ColDef[] = [
        {
          headerName: 'Already present data selector',
          field: 'autocomplete-column',
          // @ts-ignore
          cellEditor: AutocompleteSelectCellEditor,
          cellEditorParams: {
            selectData: [...this.selectDatas, ...dataToAdd],
            placeholder: 'Select an option',
            required: true,
          },
          valueFormatter: (parameters) => {
            if (parameters.value) {
              return parameters.value.label || parameters.value.value || parameters.value
            }
            return ''
          },
          editable: true,
        },
      ]
      const gridOptions = {
        columnDefs,
        rowData: rowDatas,
        suppressScrollOnNewData: false,
        suppressBrowserResizeObserver: true,
      }
      new Grid(<HTMLElement>indexQueryElement.get(0), gridOptions)
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should have groups rendered
    cy.get('.autocomplete > div.group').should('exist')
    cy.get('.autocomplete > div.group').should('have.length', 4)
    cy.get('.autocomplete > div.group:nth(0)').contains('Female')
    cy.get('.autocomplete > div.group:nth(1)').contains('Male')
    cy.get('.autocomplete > div.group:nth(2)').contains('Female')
    cy.get('.autocomplete > div.group:nth(3)').contains('Male')
  })
  it('should switch from elements from one group into another when keydown', function () {
    cy.fixture('selectDatas/groups.json').as('selectDatas')
    // @ts-ignore
    cy.visit('./static/ag-grid-autocomplete-editor-test-sandbox.html')
    cy.get('#myGrid').then((indexQueryElement) => {
      const rowDatas = [
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
      ]
      const columnDefs: ColDef[] = [
        {
          headerName: 'Already present data selector',
          field: 'autocomplete-column',
          // @ts-ignore
          cellEditor: AutocompleteSelectCellEditor,
          cellEditorParams: {
            selectData: this.selectDatas,
            placeholder: 'Select an option',
            required: true,
          },
          valueFormatter: (parameters) => {
            if (parameters.value) {
              return parameters.value.label || parameters.value.value || parameters.value
            }
            return ''
          },
          editable: true,
        },
      ]
      const gridOptions = {
        columnDefs,
        rowData: rowDatas,
        suppressScrollOnNewData: false,
        suppressBrowserResizeObserver: true,
      }
      new Grid(<HTMLElement>indexQueryElement.get(0), gridOptions)
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').type('{enter}').type('Ke')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should contain both male and female groups
    cy.get('.autocomplete > div.group:first').contains('Female')
    cy.get('.autocomplete > div.group:last').contains('Male')
    // First element which is not a group should be selected
    cy.get('.autocomplete > div:not(.group):first').should('have.class', 'selected').contains('Kelley Santana')
    // Should select element in the next group bypassing the group cell
    cy.get('.ag-row-first > .ag-cell ').type('{downArrow}').type('{downArrow}')
    // Selected element should be from male group "Ken Boggart"
    cy.get('.autocomplete > div.selected').contains('Ken Boggart')
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    // input should have been closed
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist')
    // Input should have been selected and sent to ag-grid
    cy.get('.ag-row-first > .ag-cell ').contains('Ken Boggart').should('exist')
  })
})
