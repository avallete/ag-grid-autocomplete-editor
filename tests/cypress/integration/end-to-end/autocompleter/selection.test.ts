import autocomplete, { AutocompleteItem } from 'ag-grid-autocomplete-editor/autocompleter/autocomplete'

describe('autocomplete end-to-end selection tests', () => {
  it('should display empty message when empty array', function () {
    const inputText = 'United'
    const emptyMessage = 'Nothing found message'
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      autocomplete({
        autoselectfirst: false,
        fetch(search: string, update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void) {
          update([])
        },
        onSelect(item: AutocompleteItem | undefined) {
          if (item && item.label) {
            indexQueryElement.val(item.label)
          } else {
            indexQueryElement.val('')
          }
        },
        strict: true,
        emptyMsg: emptyMessage,
        input: <HTMLInputElement>indexQueryElement.get(0),
      })
    })
    // Type some text into the autocompleter input field
    cy.get('#autocompleter').type(inputText)
    // Should display nothing found message when provided and select data is empty array
    cy.get('.autocomplete > :nth-child(1)').then((indexQueryElement) => {
      expect(indexQueryElement.text()).to.be.equal(emptyMessage)
    })
  })
  it('should not select empty message as value even if clicked', function () {
    const emptyMessage = 'Nothing found message'
    const inputText = 'United'
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      autocomplete({
        autoselectfirst: false,
        fetch(search: string, update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void) {
          update([])
        },
        onSelect(item: AutocompleteItem | undefined) {
          if (item && item.label) {
            indexQueryElement.val(item.label)
          } else {
            indexQueryElement.val('')
          }
        },
        strict: true,
        emptyMsg: emptyMessage,
        input: <HTMLInputElement>indexQueryElement.get(0),
      })
    })
    // Type some text into the autocompleter input field
    cy.get('#autocompleter').type(inputText)
    // Should display nothing found message when provided and select data is empty array
    cy.get('.autocomplete > :nth-child(1)').then((indexQueryElement) => {
      expect(indexQueryElement.text()).to.be.equal(emptyMessage)
    })
    cy.get('.autocomplete > :nth-child(1)').click()
    cy.get('#autocompleter').then((indexQueryElement) => {
      expect(indexQueryElement.val()).to.be.equal(inputText)
    })
    // The select must be close because of the click
    cy.get('.autocomplete').should('not.exist')
  })
  it('should select the clicked first element', function () {
    const inputText = 'United'
    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
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
    // Should click on the first element on the list
    cy.get('.autocomplete > :nth-child(1)').click()
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      expect(indexQueryElement.val()).to.be.equal(selectData[0].label)
    })
  })
  it('should select the clicked second element', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
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
    // Should click on the first element on the list
    cy.get('.autocomplete > :nth-child(2)').click()
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      expect(indexQueryElement.val()).to.be.equal(selectData[1].label)
    })
  })
  it('should select the first element with arrows keys and enter', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
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
    // Type some text into the input and select the first element using arrow keys
    cy.get('#autocompleter').type(inputText).type('{downarrow}').type('{enter}')
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      expect(indexQueryElement.val()).to.be.equal(selectData[0].label)
    })
  })
  it('should select the second element with arrows keys and enter', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
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
    // Type some text into the input and select the first element using arrow keys
    cy.get('#autocompleter').type(inputText).type('{downarrow}').type('{downarrow}').type('{enter}')
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      expect(indexQueryElement.val()).to.be.equal(selectData[1].label)
    })
  })
  it('should select the first element with arrows keys and tab', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
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
    // Type some text into the input and select the first element using arrow keys
    cy.get('#autocompleter').type(inputText).type('{downarrow}').trigger('keydown', {
      keyCode: 9,
      which: 9,
      shiftKey: false,
      ctrlKey: false,
    })
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      expect(indexQueryElement.val()).to.be.equal(selectData[0].label)
    })
  })
  it('should select the second element with arrows keys and tab', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
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
    // Type some text into the input and select the first element using arrow keys
    cy.get('#autocompleter').type(inputText).type('{downarrow}').type('{downarrow}').trigger('keydown', {
      keyCode: 9,
      which: 9,
      shiftKey: false,
      ctrlKey: false,
    })
    // Should click on the first element on the list
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      expect(indexQueryElement.val()).to.be.equal(selectData[1].label)
    })
  })
  it('should get previous element with upArrow', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
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
    // Type some text into the input then -> select element 1, select element 2, get back to element 1
    cy.get('#autocompleter').type(inputText).type('{downarrow}').type('{downarrow}').type('{upArrow}').type('{enter}')
    // Should click on the first element on the list
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      expect(indexQueryElement.val()).to.be.equal(selectData[0].label)
    })
  })
  it('should cycle back to first element when go down last element in the list', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
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
    // Type some text into the input then -> select element 1, select element 2, cycle back to element 1
    cy.get('#autocompleter').type(inputText).type('{downarrow}').type('{downarrow}').type('{downarrow}').type('{enter}')
    // Should click on the first element on the list
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      expect(indexQueryElement.val()).to.be.equal(selectData[0].label)
    })
  })
  it('should cycle back to last element when go up on first element in the list', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
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
    // Type some text into the input then -> select element 1, select element 2, cycle back to element 1
    cy.get('#autocompleter').type(inputText).type('{upArrow}').type('{enter}')
    // Should click on the first element on the list
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      expect(indexQueryElement.val()).to.be.equal(selectData[1].label)
    })
  })
  it('should cycle back to first element when go down once then up twice', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      autocomplete({
        autoselectfirst: false,
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
    // Type some text into the input then -> select element 1, cycle back element 2, select element 1
    cy.get('#autocompleter').type(inputText).type('{downArrow}').type('{upArrow}').type('{upArrow}').type('{enter}')
    // Should click on the first element on the list
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      expect(indexQueryElement.val()).to.be.equal(selectData[0].label)
    })
  })
  it('should cycle back to last element when go down once then up twice when autoselectfirst is true', function () {
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
    // Type some text into the input then -> select element 1, cycle back element 2, select element 1
    cy.get('#autocompleter').type(inputText).type('{downArrow}').type('{upArrow}').type('{upArrow}').type('{enter}')
    // Should click on the first element on the list
    cy.get('#autocompleter').then((indexQueryElement) => {
      const { selectData } = this
      expect(indexQueryElement.val()).to.be.equal(selectData[1].label)
    })
  })
})
