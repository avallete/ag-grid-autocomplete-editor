# ag-grid-autocomplete-editor

[![npm version](https://badge.fury.io/js/ag-grid-autocomplete-editor.svg)](https://badge.fury.io/js/ag-grid-autocomplete-editor)
[![CD](https://github.com/avallete/ag-grid-autocomplete-editor/actions/workflows/cd.yml/badge.svg)](https://github.com/avallete/ag-grid-autocomplete-editor/actions/workflows/cd.yml)
[![codecov](https://codecov.io/gh/avallete/ag-grid-autocomplete-editor/branch/master/graph/badge.svg)](https://codecov.io/gh/avallete/ag-grid-autocomplete-editor)

Quick implementation of autocompletion into [ag-Grid](https://github.com/ag-grid/ag-grid) cell using [autocompleter](https://github.com/kraaden/autocomplete) package.

## Install

```bash
npm install --save ag-grid-autocomplete-editor
```

## Description

The goal of this package is to provide an easy way to have autocompleted cellEditor into ag-Grid.

## [Demo](https://stackblitz.com/edit/ag-grid-autocomplete-editor)

![aAwS0747n5](https://user-images.githubusercontent.com/8771783/54754946-0bdae680-4be5-11e9-9a49-b2b56d0d762c.gif)

## Usage

This package provide a new cellEditor named: `AutocompleteSelectCellEditor`.
You can configure and customize the cell and behavior with the following `cellEditorParams`:

- `selectData`: is a list of data matching the type `{value: string, label: string, group?: string}`. Or a function type: `((params: IAutocompleteSelectCellEditorParams) => Array<DataFormat>)`.
  If no other parameters provided the autcompletion will use this data with a simple `.filter`. Basically, if you already have local data, you probably don't need anything else.
- `placeholder`: the placeholder is a `string` who will be put onto the input field.
- `required`: (`boolean = false`) To know if editor should cancel change if the value is undefined (no selection made).
- `autocomplete`: please see [autocompleter](https://github.com/kraaden/autocomplete) for more details about the following parameters
  - `render`: (`same as classical autocompleter`) function, except that it take the current cellEditor as first parameter.
  - `renderGroup`: (`same as classical autocompleter`) function, except that it take the current cellEditor as first parameter.
  - `className`: (`same as classical autocompleter`) default 'ag-cell-editor-autocomplete'
  - `minLength`: (`same as classical autocompleter`) default 1
  - `showOnFocus`: (`same as classical autocompleter`) default false trigger first fetch call when input is focused
  - `emptyMsg`: (`same as classical autocompleter`) default 'None'
  - `strict`: (` decide if the user can put free text or not`) default true.
  - `autoselectfirst`: (`decide the default behavior of the select (if the first row must be automatically selected or not)`): default true
  - `onFreeTextSelect`: (`function called only if the selected text does not exist on the actual select options. Must be use with strict=false`): optional Must be use with strict=false.
  - `onSelect`: (`same as classical autocompleter`) function, except that it take the current cellEditor as first parameter.
  - `fetch`: (`same as classical autocompleter`) function, except that it take the current cellEditor as first parameter.
  - `debounceWaitMs`: (`same as classical autocompleter`) default 200
  - `customize`: (`same as classical autocompleter`) function, except that it take the current cellEditor as first parameter.
- ... all the classical arguments taken by a ag-Grid `cellEditor`.

## Example

### Simple autocompletion from datasource

```js
import {AutocompleteSelectCellEditor} from 'ag-grid-autocomplete-editor';
import 'ag-grid-autocomplete-editor/dist/main.css';
...
{
   headerName: "Already present data selector",
   field: "data",
   cellEditor: AutocompleteSelectCellEditor,
   cellEditorParams: {
       selectData: [
           { label: 'Canada', value: 'CA', group: 'North America' },
           { label: 'United States', value: 'US', group: 'North America' },
           { label: 'Uzbekistan', value: 'UZ', group: 'Asia' },
       ],
       placeholder: 'Select an option',
   },
   valueFormatter: (params) => {
       if (params.value) {
           return params.value.label || params.value.value || params.value;
       }
       return "";
   },
   editable: true,
}
```

### Autocompletion with Ajax request

```js
import {AutocompleteSelectCellEditor} from 'ag-grid-autocomplete-editor';
import 'ag-grid-autocomplete-editor/dist/main.css';
...
{
   headerName: "Autocomplete with API Country based",
   field: "data",
   cellEditor: AutocompleteSelectCellEditor,
   cellEditorParams: {
       autocomplete: {
           fetch: (cellEditor, text, update) => {
                   let match = text.toLowerCase() || cellEditor.eInput.value.toLowerCase();
                   let xmlHttp = new XMLHttpRequest();
                   xmlHttp.onreadystatechange = () => {
                       if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                           let data = JSON.parse(xmlHttp.responseText);
                           let items = data.map(d => ({ value: d.numericCode, label: d.name, group: d.region }));
                           update(items);
                       }
                       if (xmlHttp.status === 404) {
                           update(false);
                       }
                   };
                   xmlHttp.open("GET", `https://restcountries.eu/rest/v2/name/${match}`, true);
                   xmlHttp.send(null);
           },
       }
       placeholder: 'Select a Country',
   },
   valueFormatter: (params) => {
       if (params.value) {
           return params.value.label || params.value.value || params.value;
       }
       return "";
   },
   editable: true,
}
```

### Simple autocompletion who allow user to enter any text

```js
import {AutocompleteSelectCellEditor} from 'ag-grid-autocomplete-editor';
import 'ag-grid-autocomplete-editor/dist/main.css';
...
{
   headerName: "Already present data selector",
   field: "data",
   cellEditor: AutocompleteSelectCellEditor,
   cellEditorParams: {
       selectData: [
           { label: 'Canada', value: 'CA', group: 'North America' },
           { label: 'United States', value: 'US', group: 'North America' },
           { label: 'Uzbekistan', value: 'UZ', group: 'Asia' },
       ],
       placeholder: 'Select an option',
       autocomplete: {
           strict: false,
           autoselectfirst: false,
       }
   },
   valueFormatter: (params) => {
       if (params.value) {
           return params.value.label || params.value.value || params.value;
       }
       return "";
   },
   editable: true,
}
```

## Dependencies

- [ag-Grid](https://github.com/ag-grid/ag-grid)

## Thank's to

- Thank's to [ag-grid-auto-complete](https://github.com/superman-lopez/ag-grid-auto-complete) who was aiming AngularJS and was inspirational source for this package.
- Thank's to [autocompleter](https://github.com/kraaden/autocomplete) for the easy and really customizable autocompletion logic.
- Thank's to [ag-Grid](https://github.com/ag-grid/ag-grid) for the great ag-Grid package.

## LICENSE

This project is onto MIT license see [LICENSE](./LICENSE) file.
