import autocomplete, {AutocompleteItem, EventTrigger} from 'ag-grid-autocomplete-editor/autocompleter/autocomplete';

describe('autocomplete end-to-end className tests', () => {
    it('should show select with the added className passed as parameter', function () {
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
                    className: 'test-class',
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
        // Should have added the test-class to the autocomplete select
        cy.get('.autocomplete.test-class');
    });
});
