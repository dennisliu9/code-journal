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

function persistFormData(event) {
  localStorage.setItem('code-journal-entry-data', JSON.stringify(data));
}
window.addEventListener('beforeunload', persistFormData);
