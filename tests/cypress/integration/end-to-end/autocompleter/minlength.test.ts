import autocomplete, { AutocompleteItem, EventTrigger } from 'ag-grid-autocomplete-editor/autocompleter/autocomplete'

describe('autocomplete end-to-end minlength tests', () => {
  it('should not show select list until minLength is greater than equal input length', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((jQueryElement) => {
      const selectData = this.selectData
      autocomplete({
        autoselectfirst: false,
        minLength: inputText.length,
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
    cy.get('#autocompleter').type(inputText.slice(0, inputText.length - 1))
    // The minLength is not set, the list should not exist
    cy.get('.autocomplete').should('not.exist')
    cy.get('#autocompleter').type(inputText.slice(inputText.length - 1, inputText.length))
    // Should show the select list on the page
    cy.get('.autocomplete')
  })
})
