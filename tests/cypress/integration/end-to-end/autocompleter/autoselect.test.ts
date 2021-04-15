import autocomplete, { AutocompleteItem } from 'ag-grid-autocomplete-editor/autocompleter/autocomplete'

describe('autocomplete end-to-end autoselect tests', () => {
  it('should not autoselect first when outside click is detected', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: true,
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
    // Should show the select list on the page
    cy.get('.autocomplete')
    cy.get('html').realClick()
    cy.get('.autocomplete').should('not.exist')
    cy.get('#autocompleter').then((indexQueryElement) => {
      expect(indexQueryElement.val()).to.be.equal(inputText)
    })
  })
  it('should not autoselect first escape key is sent', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: true,
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
    // Should show the select list on the page
    cy.get('.autocomplete')
    // Should close the list with escape key
    cy.get('#autocompleter').type('{esc}')
    cy.get('.autocomplete').should('not.exist')
    cy.get('#autocompleter').then((indexQueryElement) => {
      expect(indexQueryElement.val()).to.be.equal('')
    })
  })
  it('should autoselect first when enter key is sent', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: true,
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
    // Should show the select list on the page
    cy.get('.autocomplete > :nth-child(1)').then((indexQueryElement) => {
      expect(indexQueryElement.hasClass('selected')).to.be.equal(true)
    })
    // Should close the list with escape key
    cy.get('#autocompleter').type('{enter}')
    cy.get('.autocomplete').should('not.exist')
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      expect(indexQueryElement.val()).to.be.equal(selectData[0].label)
    })
  })
})
