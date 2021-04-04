import autocomplete, { EventTrigger } from 'ag-grid-autocomplete-editor/autocompleter/autocomplete'

describe('autocomplete end-to-end basic tests', () => {
  it('should show select options when text typed', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((jQueryElement) => {
      const selectData = this.selectData
      autocomplete({
        autoselectfirst: false,
        fetch: function (
          search: string,
          update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void,
          _: EventTrigger
        ) {
          update(selectData)
        },
        onSelect: function () {},
        strict: true,
        input: <HTMLInputElement>jQueryElement.get(0),
      })
    })
    // Type some text into the autocompleter input field
    cy.get('#autocompleter').type(inputText)
    // Should show the select list on the page
    cy.get('.autocomplete').then((jQueryElement) => {
      expect(jQueryElement.get(0).childElementCount).to.be.equal(this.selectData.length)
    })
  })
  it('should close select when outside click is detected', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((jQueryElement) => {
      const selectData = this.selectData
      autocomplete({
        autoselectfirst: false,
        fetch: function (
          search: string,
          update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void,
          _: EventTrigger
        ) {
          update(selectData)
        },
        onSelect: function () {},
        strict: true,
        input: <HTMLInputElement>jQueryElement.get(0),
      })
    })
    // Type some text into the autocompleter input field
    cy.get('#autocompleter').type(inputText)
    // Should show the select list on the page
    cy.get('.autocomplete')
    cy.get('html').trigger('mousemove', 'bottomRight').click()
    cy.get('.autocomplete').should('not.exist')
  })
  it('should not call onSelect when outside click is detected', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((jQueryElement) => {
      const selectData = this.selectData
      autocomplete({
        autoselectfirst: false,
        fetch: function (
          search: string,
          update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void,
          _: EventTrigger
        ) {
          update(selectData)
        },
        onSelect: function () {
          jQueryElement.val('invalid')
        },
        strict: true,
        input: <HTMLInputElement>jQueryElement.get(0),
      })
    })
    // Type some text into the autocompleter input field
    cy.get('#autocompleter').type(inputText)
    // Should show the select list on the page
    cy.get('.autocomplete')
    cy.get('html').trigger('mousemove', 'bottomRight').click()
    cy.get('.autocomplete').should('not.exist')
    cy.get('#autocompleter').then((jQueryElement) => {
      expect(jQueryElement.val()).to.be.equal(inputText)
    })
  })
  it('should close select when escape key is sent', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((jQueryElement) => {
      const selectData = this.selectData
      autocomplete({
        autoselectfirst: false,
        fetch: function (
          search: string,
          update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void,
          _: EventTrigger
        ) {
          update(selectData)
        },
        onSelect: function () {},
        strict: true,
        input: <HTMLInputElement>jQueryElement.get(0),
      })
    })
    // Type some text into the autocompleter input field
    cy.get('#autocompleter').type(inputText)
    // Should show the select list on the page
    cy.get('.autocomplete')
    // Should close the list with escape key
    cy.get('#autocompleter').type('{esc}')
    cy.get('.autocomplete').should('not.exist')
  })
  it('should call onSelect with undefined item when escape key is sent', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((jQueryElement) => {
      const selectData = this.selectData
      autocomplete({
        autoselectfirst: false,
        fetch: function (
          search: string,
          update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void,
          _: EventTrigger
        ) {
          update(selectData)
        },
        onSelect: function (item: any) {
          if (item) {
            jQueryElement.val('should be undefined')
          } else {
            jQueryElement.val('undefined')
          }
        },
        strict: true,
        input: <HTMLInputElement>jQueryElement.get(0),
      })
    })
    // Type some text into the autocompleter input field
    cy.get('#autocompleter').type(inputText)
    // Should show the select list on the page
    cy.get('.autocomplete')
    // Should close the list with escape key
    cy.get('#autocompleter').type('{esc}')
    cy.get('.autocomplete').should('not.exist')
    cy.get('#autocompleter').then((jQueryElement) => {
      expect(jQueryElement.val()).to.be.equal('undefined')
    })
  })
})
