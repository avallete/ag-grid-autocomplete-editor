import autocomplete, { AutocompleteItem } from 'ag-grid-autocomplete-editor/autocompleter/autocomplete'

describe('autocomplete end-to-end minlength tests', () => {
  it('should not show select list until minLength is greater than equal input length', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./cypress/static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
        minLength: inputText.length,
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
    cy.get('#autocompleter').type(inputText.slice(0, -1))
    // The minLength is not set, the list should not exist
    cy.get('.autocomplete').should('not.exist')
    cy.get('#autocompleter').type(inputText.slice(-1, inputText.length))
    // Should show the select list on the page
    cy.get('.autocomplete')
  })

  it('should always show select list when user delete to empty with minLength equals 0', function () {
    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./cypress/static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
        minLength: 0,
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
    // Any input value exist before focus won't be counted unless user type or delete something for all cases,
    // no matter what the minLength is set.
    cy.get('#autocompleter').click()
    cy.get('.autocomplete').should('not.exist')

    // Type anything in the input, then delete to empty.
    cy.get('#autocompleter').type('randomText').clear()
    // Should show the select list on the page
    cy.get('.autocomplete')
  })
})
