import autocomplete, {AutocompleteItem, EventTrigger} from 'ag-grid-autocomplete-editor/autocompleter/autocomplete';

describe('autocomplete end-to-end selection tests', () => {
    it('should display empty message when empty array', function () {
        const inputText = 'United';
        const emptyMsg = 'Nothing found message';
        // @ts-ignore
        cy.visit('./static/autocomplete-test-sandbox.html');
        // Get the input element and setup autocomplete to it
        cy.get('#autocompleter')
            .then((jQueryElement => {
                autocomplete({
                    autoselectfirst: false,
                    fetch: function (search: string, update: <AutocompleteItem>(items: (AutocompleteItem[] | false)) => void, _: EventTrigger) {
                        update([]);
                    },
                    onSelect: function (item: AutocompleteItem | undefined) {
                        if (item && item.label) {
                            jQueryElement.val(item.label)
                        } else {
                            jQueryElement.val('');
                        }
                    },
                    strict: true,
                    emptyMsg: emptyMsg,
                    input: <HTMLInputElement>jQueryElement.get(0),
                });

            }));
        // Type some text into the autocompleter input field
        cy.get('#autocompleter').type(inputText);
        // Should display nothing found message when provided and select data is empty array
        cy.get('.autocomplete > :nth-child(1)').then((jQueryElement) => {
            expect(jQueryElement.text()).to.be.equal(emptyMsg);
        });
    });
    it('should not select empty message as value even if clicked', function () {
        const emptyMsg = 'Nothing found message';
        const inputText = 'United';
        // @ts-ignore
        cy.visit('./static/autocomplete-test-sandbox.html');
        // Get the input element and setup autocomplete to it
        cy.get('#autocompleter')
            .then((jQueryElement => {
                autocomplete({
                    autoselectfirst: false,
                    fetch: function (search: string, update: <AutocompleteItem>(items: (AutocompleteItem[] | false)) => void, _: EventTrigger) {
                        update([]);
                    },
                    onSelect: function (item: AutocompleteItem | undefined) {
                        if (item && item.label) {
                            jQueryElement.val(item.label)
                        } else {
                            jQueryElement.val('');
                        }
                    },
                    strict: true,
                    emptyMsg: emptyMsg,
                    input: <HTMLInputElement>jQueryElement.get(0),
                });

            }));
        // Type some text into the autocompleter input field
        cy.get('#autocompleter').type(inputText);
        // Should display nothing found message when provided and select data is empty array
        cy.get('.autocomplete > :nth-child(1)').then((jQueryElement) => {
            expect(jQueryElement.text()).to.be.equal(emptyMsg);
        });
        cy.get('.autocomplete > :nth-child(1)').click();
        cy.get('#autocompleter').then(jQueryElement => {
            expect(jQueryElement.val()).to.be.equal(inputText);
        });
        // The select must be close because of the click
        cy.get('.autocomplete').should('not.exist');
    });
    it('should select the clicked first element', function () {
        const inputText = 'United';
        cy.fixture('selectDatas/united.json').as('selectData');
        // @ts-ignore
        cy.visit('./static/autocomplete-test-sandbox.html');
        // Get the input element and setup autocomplete to it
        cy.get('#autocompleter')
            .then((jQueryElement => {
                const selectData = this.selectData;
                autocomplete({
                    autoselectfirst: false,
                    fetch: function (search: string, update: <AutocompleteItem>(items: (AutocompleteItem[] | false)) => void, _: EventTrigger) {
                        update(selectData);
                    },
                    onSelect: function (item: AutocompleteItem | undefined) {
                        if (item && item.label) {
                            jQueryElement.val(item.label)
                        } else {
                            jQueryElement.val('');
                        }
                    },
                    strict: true,
                    input: <HTMLInputElement>jQueryElement.get(0),
                });

            }));
        // Type some text into the autocompleter input field
        cy.get('#autocompleter').type(inputText);
        // Should click on the first element on the list
        cy.get('.autocomplete > :nth-child(1)').click();
        cy.get('#autocompleter').then(jQueryElement => {
            const selectData = this.selectData;
            expect(jQueryElement.val()).to.be.equal(selectData[0].label);
        });
    });
    it('should select the clicked second element', function () {
        const inputText = 'United';

        cy.fixture('selectDatas/united.json').as('selectData');
        // @ts-ignore
        cy.visit('./static/autocomplete-test-sandbox.html');
        // Get the input element and setup autocomplete to it
        cy.get('#autocompleter')
            .then((jQueryElement => {
                const selectData = this.selectData;
                autocomplete({
                    autoselectfirst: false,
                    fetch: function (search: string, update: <AutocompleteItem>(items: (AutocompleteItem[] | false)) => void, _: EventTrigger) {
                        update(selectData);
                    },
                    onSelect: function (item: AutocompleteItem | undefined) {
                        if (item && item.label) {
                            jQueryElement.val(item.label)
                        } else {
                            jQueryElement.val('');
                        }
                    },
                    strict: true,
                    input: <HTMLInputElement>jQueryElement.get(0),
                });

            }));
        // Type some text into the autocompleter input field
        cy.get('#autocompleter').type(inputText);
        // Should click on the first element on the list
        cy.get('.autocomplete > :nth-child(2)').click();
        cy.get('#autocompleter').then(jQueryElement => {
            const selectData = this.selectData;
            expect(jQueryElement.val()).to.be.equal(selectData[1].label);
        });
    });
    it('should select the first element with arrows keys and enter', function () {
        const inputText = 'United';

        cy.fixture('selectDatas/united.json').as('selectData');
        // @ts-ignore
        cy.visit('./static/autocomplete-test-sandbox.html');
        // Get the input element and setup autocomplete to it
        cy.get('#autocompleter')
            .then((jQueryElement => {
                const selectData = this.selectData;
                autocomplete({
                    autoselectfirst: false,
                    fetch: function (search: string, update: <AutocompleteItem>(items: (AutocompleteItem[] | false)) => void, _: EventTrigger) {
                        update(selectData);
                    },
                    onSelect: function (item: AutocompleteItem | undefined) {
                        if (item && item.label) {
                            jQueryElement.val(item.label)
                        } else {
                            jQueryElement.val('');
                        }
                    },
                    strict: true,
                    input: <HTMLInputElement>jQueryElement.get(0),
                });

            }));
        // Type some text into the input and select the first element using arrow keys
        cy.get('#autocompleter')
            .type(inputText)
            .type('{downarrow}')
            .type('{enter}');
        // Should click on the first element on the list
        cy.get('#autocompleter').then(jQueryElement => {
            const selectData = this.selectData;
            expect(jQueryElement.val()).to.be.equal(selectData[0].label);
        });
    });
    it('should select the second element with arrows keys and enter', function () {
        const inputText = 'United';

        cy.fixture('selectDatas/united.json').as('selectData');
        // @ts-ignore
        cy.visit('./static/autocomplete-test-sandbox.html');
        // Get the input element and setup autocomplete to it
        cy.get('#autocompleter')
            .then((jQueryElement => {
                const selectData = this.selectData;
                autocomplete({
                    autoselectfirst: false,
                    fetch: function (search: string, update: <AutocompleteItem>(items: (AutocompleteItem[] | false)) => void, _: EventTrigger) {
                        update(selectData);
                    },
                    onSelect: function (item: AutocompleteItem | undefined) {
                        if (item && item.label) {
                            jQueryElement.val(item.label)
                        } else {
                            jQueryElement.val('');
                        }
                    },
                    strict: true,
                    input: <HTMLInputElement>jQueryElement.get(0),
                });

            }));
        // Type some text into the input and select the first element using arrow keys
        cy.get('#autocompleter')
            .type(inputText)
            .type('{downarrow}')
            .type('{downarrow}')
            .type('{enter}');
        // Should click on the first element on the list
        cy.get('#autocompleter').then(jQueryElement => {
            const selectData = this.selectData;
            expect(jQueryElement.val()).to.be.equal(selectData[1].label);
        });
    });
});
