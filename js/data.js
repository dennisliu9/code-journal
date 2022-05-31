/* exported data */

var data = {};
if (localStorage.getItem('code-journal-entry-data') === null) {
  data = {
    view: 'entry-form',
    entries: [],
    editing: null,
    nextEntryId: 1
  };
} else {
  data = JSON.parse(localStorage.getItem('code-journal-entry-data'));
}
