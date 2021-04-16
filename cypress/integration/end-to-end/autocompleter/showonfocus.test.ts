import autocomplete, { AutocompleteItem } from 'ag-grid-autocomplete-editor/autocompleter/autocomplete'

describe('autocomplete end-to-end showonfocus tests', () => {
  it('should show select list on focus', function () {
    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./cypress/static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
        showOnFocus: true,
        fetch(search: string, update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void) {
          update(selectData)
        },
        onSelect(item: AutocompleteItem | undefined) {
          if (item && item.label) {
            indexQueryElement.val(item.label)
          } else {
            indexQueryElement.val('')
          }
        },
        strict: true,
        input: <HTMLInputElement>indexQueryElement.get(0),
      })
    })
    // Type some text into the autocompleter input field
    cy.get('#autocompleter').trigger('focus')
    // Should have opened the list on focus
    cy.get('.autocomplete')
  })
  it('should show select list whatever is minLength', function () {
    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./cypress/static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
        showOnFocus: true,
        minLength: 10,
        fetch(search: string, update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void) {
          update(selectData)
        },
        onSelect(item: AutocompleteItem | undefined) {
          if (item && item.label) {
            indexQueryElement.val(item.label)
          } else {
            indexQueryElement.val('')
          }
        },
        strict: true,
        input: <HTMLInputElement>indexQueryElement.get(0),
      })
    })
    // Type some text into the autocompleter input field
    cy.get('#autocompleter').trigger('focus')
    // Should have opened the list on focus
    cy.get('.autocomplete')
  })
})
