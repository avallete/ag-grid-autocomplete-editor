import autocomplete from 'ag-grid-autocomplete-editor/autocompleter/autocomplete'

describe('autocomplete unit testing constructor', () => {
  it('should be a function', () => {
    expect(autocomplete).to.be.a('function')
  })
  it('should return an object', () => {
    expect(
      autocomplete({
        autoselectfirst: false,
        fetch: function () {},
        onSelect: function () {},
        strict: false,
        input: window.document.body as HTMLInputElement,
      })
    ).to.be.an('object')
  })
  it('should return an object with wanted properties', () => {
    let res = autocomplete({
      autoselectfirst: false,
      fetch: function () {},
      onSelect: function () {},
      strict: false,
      input: window.document.body as HTMLInputElement,
    })
    expect(res).to.be.an('object')
    expect(res.destroy).to.be.a('function')
  })
  it('should properly mount on sandbox page', () => {
    cy.visit('./static/autocomplete-test-sandbox.html')
    // Get the input element
    cy.get('#autocompleter').then((currentSubject) => {
      let res = autocomplete({
        autoselectfirst: false,
        fetch: function () {},
        onSelect: function () {},
        strict: false,
        input: <HTMLInputElement>currentSubject.get(0),
      })
      expect(res).to.be.an('object')
      expect(res.destroy).to.be.a('function')
    })
  })
})
