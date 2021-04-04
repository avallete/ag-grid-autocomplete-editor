import autocomplete, { AutocompleteItem, EventTrigger } from 'ag-grid-autocomplete-editor/autocompleter/autocomplete'

describe('autocomplete end-to-end showonfocus tests', () => {
  it('should show select list on focus', function () {
    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((jQueryElement) => {
      const selectData = this.selectData
      autocomplete({
        autoselectfirst: false,
        showOnFocus: true,
        fetch: function (
          search: string,
          update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void,
          _: EventTrigger
        ) {
          update(selectData)
        },
        onSelect: function (item: AutocompleteItem | undefined) {
          if (item && item.label) {
            jQueryElement.val(item.label)
          } else {
            jQueryElement.val('')
          }
        },
        strict: true,
        input: <HTMLInputElement>jQueryElement.get(0),
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
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((jQueryElement) => {
      const selectData = this.selectData
      autocomplete({
        autoselectfirst: false,
        showOnFocus: true,
        minLength: 10,
        fetch: function (
          search: string,
          update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void,
          _: EventTrigger
        ) {
          update(selectData)
        },
        onSelect: function (item: AutocompleteItem | undefined) {
          if (item && item.label) {
            jQueryElement.val(item.label)
          } else {
            jQueryElement.val('')
          }
        },
        strict: true,
        input: <HTMLInputElement>jQueryElement.get(0),
      })
    })
    // Type some text into the autocompleter input field
    cy.get('#autocompleter').trigger('focus')
    // Should have opened the list on focus
    cy.get('.autocomplete')
  })
})
