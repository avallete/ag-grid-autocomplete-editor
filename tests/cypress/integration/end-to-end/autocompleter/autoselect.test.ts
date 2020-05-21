import autocomplete, {AutocompleteItem, EventTrigger} from 'ag-grid-autocomplete-editor/autocompleter/autocomplete';

describe('autocomplete end-to-end autoselect tests', () => {
    it('should not autoselect first when outside click is detected', function () {
        const inputText = 'United';

        cy.fixture('selectDatas/united.json').as('selectData');
        // @ts-ignore
        cy.visit('./static/autocomplete-test-sandbox.html');
        // Get the input element and setup autocomplete to it
        cy.get('#autocompleter')
            .then((jQueryElement => {
                const selectData = this.selectData;
                autocomplete({
                    autoselectfirst: true,
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
        // Should show the select list on the page
        cy.get('.autocomplete');
        cy.get('html').trigger('mousemove', 'bottomRight').click();
        cy.get('.autocomplete').should('not.exist');
        cy.get('#autocompleter').then(jQueryElement => {
            expect(jQueryElement.val()).to.be.equal(inputText);
        });
    });
    it('should not autoselect first escape key is sent', function () {
        const inputText = 'United';

        cy.fixture('selectDatas/united.json').as('selectData');
        // @ts-ignore
        cy.visit('./static/autocomplete-test-sandbox.html');
        // Get the input element and setup autocomplete to it
        cy.get('#autocompleter')
            .then((jQueryElement => {
                const selectData = this.selectData;
                autocomplete({
                    autoselectfirst: true,
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
        // Should show the select list on the page
        cy.get('.autocomplete');
        // Should close the list with escape key
        cy.get('#autocompleter')
            .type('{del}')
            .type('{esc}');
        cy.get('.autocomplete').should('not.exist');
        cy.get('#autocompleter').then(jQueryElement => {
            expect(jQueryElement.val()).to.be.equal('');
        });
    });
    it('should autoselect first when enter key is sent', function () {
        const inputText = 'United';

        cy.fixture('selectDatas/united.json').as('selectData');
        // @ts-ignore
        cy.visit('./static/autocomplete-test-sandbox.html');
        // Get the input element and setup autocomplete to it
        cy.get('#autocompleter')
            .then((jQueryElement => {
                const selectData = this.selectData;
                autocomplete({
                    autoselectfirst: true,
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
        // Should show the select list on the page
        cy.get('.autocomplete > :nth-child(1)').then((jQueryElement) => {
            expect(jQueryElement.hasClass('selected')).to.be.equal(true);
        });
        cy.get('#autocompleter')
            .type('{enter}');
        cy.get('.autocomplete').should('not.exist');
        cy.get('#autocompleter').then(jQueryElement => {
            const selectData = this.selectData;
            expect(jQueryElement.val()).to.be.equal(selectData[0].label);
        });
    });
});
