import autocomplete, {
    AutocompleteItem,
    AutocompleteSettings,
    EventTrigger
} from 'ag-grid-autocomplete-editor/autocompleter/autocomplete';

describe('autocomplete end-to-end strict tests', () => {
    it('should call onSelect with undefined when strict is true and no elements from fetch', function () {
        const inputText = 'United';

        cy.fixture('selectDatas/united.json').as('selectData');
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
                            jQueryElement.val('undefined');
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
            expect(jQueryElement.val()).to.be.equal('undefined');
        });
    });
    it('should not call onFreeTextSelect when strict is true', function () {
        const inputText = 'United';
        let autocompleteSettings: Partial<AutocompleteSettings<AutocompleteItem>> = {
            autoselectfirst: false,
            fetch: function (search: string, update: <AutocompleteItem>(items: (AutocompleteItem[] | false)) => void, _: EventTrigger) {
                update([]);
            },
            onSelect: function () {
            },
            onFreeTextSelect: () => {
            },
            strict: true
        };
        const spyFreeTextSelect = cy.spy(autocompleteSettings, 'onFreeTextSelect').as('onFreeTextSpy');
        const spyOnSelect = cy.spy(autocompleteSettings, 'onSelect').as('onSelectSpy');

        // @ts-ignore
        cy.visit('./static/autocomplete-test-sandbox.html');
        // Get the input element and setup autocomplete to it
        cy.get('#autocompleter')
            .then((jQueryElement => {
                autocompleteSettings.input = jQueryElement.get(0) as HTMLInputElement;
                autocomplete(autocompleteSettings as AutocompleteSettings<AutocompleteItem>);
            }));
        // Type some text into the input and select the first element using arrow keys
        cy.get('#autocompleter')
            .type(inputText)
            .type('{downarrow}')
            .type('{enter}')
            .then(() => {
                expect(spyOnSelect).to.be.calledOnce;
                expect(spyOnSelect.getCall(0).args[0]).to.eql(undefined);
                expect(spyFreeTextSelect).to.not.be.called;
            });

    });
    it('should call onSelect actual input when strict is false and no elements from fetch', function () {
        const inputText = 'United';

        cy.fixture('selectDatas/united.json').as('selectData');
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
                            jQueryElement.val('undefined');
                        }
                    },
                    strict: false,
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
            expect(jQueryElement.val()).to.be.equal('United');
        });
    });
    it('should call onFreeTextSelect when strict is true', function () {
        const inputText = 'United';
        let autocompleteSettings: Partial<AutocompleteSettings<AutocompleteItem>> = {
            autoselectfirst: false,
            fetch: function (search: string, update: <AutocompleteItem>(items: (AutocompleteItem[] | false)) => void, _: EventTrigger) {
                update([]);
            },
            onSelect: function () {
            },
            onFreeTextSelect: () => {
            },
            strict: false
        };
        const spyFreeTextSelect = cy.spy(autocompleteSettings, 'onFreeTextSelect').as('onFreeTextSpy');
        const spyOnSelect = cy.spy(autocompleteSettings, 'onSelect').as('onSelectSpy');

        // @ts-ignore
        cy.visit('./static/autocomplete-test-sandbox.html');
        // Get the input element and setup autocomplete to it
        cy.get('#autocompleter')
            .then((jQueryElement => {
                autocompleteSettings.input = jQueryElement.get(0) as HTMLInputElement;
                autocomplete(autocompleteSettings as AutocompleteSettings<AutocompleteItem>);
            }));
        // Type some text into the input and select the first element using arrow keys
        cy.get('#autocompleter')
            .type(inputText)
            .type('{downarrow}')
            .type('{enter}')
            .then(() => {
                expect(spyOnSelect).to.be.calledOnce;
                expect(spyOnSelect.getCall(0).args[0]).to.eql({label: inputText});
                expect(spyFreeTextSelect).to.be.calledOnce;
                expect(spyFreeTextSelect.getCall(0).args[0]).to.eql({label: inputText});
            });
    });
});
