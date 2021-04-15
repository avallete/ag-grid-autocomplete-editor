import autocomplete, { AutocompleteItem } from 'ag-grid-autocomplete-editor/autocompleter/autocomplete'

describe('autocomplete end-to-end className tests', () => {
  it('should show select with the added className passed as parameter', function () {
    const inputText = 'United'
    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
        className: 'test-class',
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
    cy.get('#autocompleter').type(inputText)
    // Should have added the test-class to the autocomplete select
    cy.get('.autocomplete.test-class')
  })
})
