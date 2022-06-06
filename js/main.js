/* global data */

// Global Variables
//    render
var $entriesList = document.querySelector('#entries-list');
//    form
var $form = document.querySelector('#entry-area');
var $photoURL = document.querySelector('#photo-url');
//    delete modal
var $deleteModal = document.querySelector('.modal-screen');
// event listener targets
var $logoNav = document.querySelector('#logo-nav');
var $entriesNav = document.querySelector('#entries-nav');
var $newEntry = document.querySelector('#new-entry-button');
var $deleteButton = document.querySelector('#delete-entry-button');
var $deleteModalCancel = document.querySelector('#del-modal-cancel');
var $deleteModalConfirm = document.querySelector('#del-modal-confirm');
var $darkModeToggle = document.querySelector('#dark-mode-toggle');

// Render Entries
function renderEntry(entryObj) {
  // Render journal entries according to sample HTML, get data from entryObj
  // entryObj will be an item in array data.entries
  /* -- Sample Entry HTML --
  <li data-entry-id=[entryObj.entryId]>
    <div class="row">
      <div class="column-half flex-col justify-center">
        <img src=[entryObj.photoURL] alt="User selected image">
      </div>
      <div class="column-half pos-rel">
        <h2>[entryObj.title]</h2>
        <p class="font-regular">
          [entryObj.notes]
        </p>
        <a href="#" class="no-text-deco">
          <i class="fa-solid fa-pen color-accent edit-icon-pos"></i>
        </a>
      </div>
    </div>
  </li>
  */
  var $entryLi = document.createElement('li');
  $entryLi.setAttribute('data-entry-id', entryObj.entryId);

  var $entryRow = document.createElement('div');
  $entryRow.className = 'row';

  var $imgCol = document.createElement('div');
  $imgCol.className = 'column-half flex-col justify-center';
  var $txtCol = document.createElement('div');
  $txtCol.className = 'column-half pos-rel';

  var $entryPhoto = document.createElement('img');
  $entryPhoto.setAttribute('src', entryObj.photoURL);
  $entryPhoto.setAttribute('alt', 'User selected image');

  var $entryTitle = document.createElement('h2');
  $entryTitle.textContent = entryObj.title;
  var $entryNotes = document.createElement('p');
  $entryNotes.textContent = entryObj.notes;
  $entryNotes.className = 'font-regular';

  var $editIconWrapper = document.createElement('a');
  $editIconWrapper.setAttribute('href', '#');
  $editIconWrapper.className = 'no-text-deco';
  $editIconWrapper.setAttribute('data-view', 'entry-form');

  var $editIcon = document.createElement('i');
  $editIcon.className = 'fa-solid fa-pen color-accent edit-icon-pos';

  $editIconWrapper.appendChild($editIcon);

  $txtCol.appendChild($entryTitle);
  $txtCol.appendChild($entryNotes);
  $txtCol.appendChild($editIconWrapper);
  $imgCol.appendChild($entryPhoto);

  $entryRow.appendChild($imgCol);
  $entryRow.appendChild($txtCol);

  $entryLi.appendChild($entryRow);

  return $entryLi;
}

function renderAllEntriesOnto(arrayOfChildren, parent) {
  /*
  renderAllEntries
  - calls renderEntry() on each object in arrayOfChildren and appends to parent

  If there are no entries in data.entries
    Create a p element saying No Entries have been recorded
  Otherwise, if there are entries in data.entries
    Loop through the entries
      Call renderEntry() on each
      Append result to parent
  */
  if (arrayOfChildren.length !== 0) {
    for (var entryIdx = 0; entryIdx < arrayOfChildren.length; entryIdx++) {
      var $entryTree = renderEntry(arrayOfChildren[entryIdx]);
      parent.appendChild($entryTree);
    }
  } else {
    var $blankEntriesText = document.createElement('p');
    $blankEntriesText.textContent = 'No entries have been recorded.';
    $blankEntriesText.className = 'body-font font-regular text-center';
    parent.appendChild($blankEntriesText);
  }
}

// Entry Form
function updatePhotoPreview(event) {
  var $photo = document.querySelector('#input-img');
  if ($photoURL.value !== '') {
    $photo.setAttribute('src', $photoURL.value);
    $photo.setAttribute('alt', 'User selected image');
  } else {
    $photo.setAttribute('src', 'images/placeholder-image-square.jpg');
    $photo.setAttribute('alt', 'placeholder image');
  }
}

function resetForm() {
  $form.reset();
  updatePhotoPreview(null);
  if (!$form.elements.deleteEntryButton.classList.contains('invisible')) {
    $form.elements.deleteEntryButton.classList.add('invisible');
  }
}

function saveFormData(event) {
  event.preventDefault();
  var formData = {};

  if (data.editing === null) {
    formData = {
      entryId: data.nextEntryId,
      title: $form.elements.entryTitle.value,
      photoURL: $form.elements.photoURL.value,
      notes: $form.elements.entryNotes.value
    };
    // save data
    data.entries.unshift(formData);
    data.nextEntryId++;
    // add DOM tree
    $entriesList.prepend(renderEntry(formData));
  } else {
    formData = {
      entryId: data.editing.entryId,
      title: $form.elements.entryTitle.value,
      photoURL: $form.elements.photoURL.value,
      notes: $form.elements.entryNotes.value
    };
    // save data
    var entriesUpdateIdx = data.entries.findIndex(obj => obj.entryId === formData.entryId);
    data.entries[entriesUpdateIdx] = formData;
    // replace DOM tree
    // for (var childIdx = 0; childIdx < $entriesList.children.length; childIdx++) {
    //   var $currentChild = $entriesList.children[childIdx];
    //   var currentEntryId = String($currentChild.getAttribute('data-entry-id'));
    //   if (currentEntryId === String(data.editing.entryId)) {
    //     $currentChild.replaceWith(renderEntry(data.entries[entriesUpdateIdx]));
    //   }
    // }
    var $elToReplace = $entriesList.querySelector('[data-entry-id="' + data.editing.entryId + '"]');
    $elToReplace.replaceWith(renderEntry(data.entries[entriesUpdateIdx]));
  }
  // reset form and image
  resetForm();
  // show entries
  switchToView('entries');
}

function switchToView(dataViewToShow) {
  /*
  switchToView - general function to hide views except desired one

  Provided a array of nodes of the data views and a string with the data view to show
  Loop through array
    Check if the data-view attribute matches the desired one
      If not, make it hidden by adjusting the class name
    If it is, set the class name to an empty string
  If dataViewToShow === 'entries', we will want to render the entries tree again
    Query for the ul element containing all of the entry list items (id entries-list)
    Clear out all children nodes
    If data.entries is empty
      Create a new p element object and set its textContent to "No entries have been recorded"
      Apply styling classes
      Append as child to the entries list
    Loop through data.entries and call renderEntry() on each
    Append the created DOM tree for each entry to the now cleared entries list
  Update the data object with the now current view
  (This function should be called at the end of the 'submit' event listener)
  */
  var $views = document.querySelectorAll('.view');
  for (var vwIdx = 0; vwIdx < $views.length; vwIdx++) {
    if ($views[vwIdx].getAttribute('data-view') !== dataViewToShow) {
      $views[vwIdx].className = 'view hidden';
    } else {
      $views[vwIdx].className = 'view';
    }
  }
  if (dataViewToShow === 'entries') {
    data.editing = null; // Whenever the view switches to entries, editing should be cleared
  }
  data.view = dataViewToShow;
}

// Edit Button Capabilities
function handleEditClick(event) {
  /*
  handleEditClick - behavior when an edit icon is clicked

  Check if the clicked target is the icon by the tagName
    If not, return (use a guard)
  Get the parent li element by querying for closest li with data-entry-id
  Get the parent's entry id to search the data object
    Convert this (and the id in the data object) to a string to standardize types
  Loop through the data.entries array
    If the current object data.entries has the same entry id as the clicked element
      Set data.editing to that object

  [pre-populate the form]
  Reset the photo preview
  Switch view to entry form
  */
  // guard
  if (event.target.tagName !== 'I') {
    return;
  }

  var $parentLi = event.target.closest('li[data-entry-id]');
  var parentLiEntryId = $parentLi.getAttribute('data-entry-id');
  parentLiEntryId = String(parentLiEntryId);
  for (var dataEntriesIdx = 0; dataEntriesIdx < data.entries.length; dataEntriesIdx++) {
    var currentEntryId = String(data.entries[dataEntriesIdx].entryId);
    if (currentEntryId === parentLiEntryId) {
      data.editing = data.entries[dataEntriesIdx];
    }
  }
  // pre-populate form
  $form.elements.entryTitle.value = data.editing.title;
  $form.elements.photoURL.value = data.editing.photoURL;
  $form.elements.entryNotes.value = data.editing.notes;
  updatePhotoPreview(null);
  // reveal delete button
  $form.elements.deleteEntryButton.classList.remove('invisible');
  // find data-view on containing <a> and use to swap
  var $dataViewHolder = event.target.closest('[data-view]');
  switchToView($dataViewHolder.getAttribute('data-view'));
}

// Delete Button and Delete Modal
function handleDeleteClick(event) {
  // Animating modal from hidden
  // https://cloudfour.com/thinks/transitioning-hidden-elements/
  $deleteModal.classList.remove('hidden');
  // force a reflow so the modal is redrawn before transitioning
  var forceReflow = $deleteModal.offsetHeight;
  $deleteModal.classList.add('modal-screen-transition');
}

function handleModalCancel(event) {
  function dummyListener() {
    // this is run when the transition finishes, hiding and removing the event listener
    $deleteModal.classList.add('hidden');
    $deleteModal.removeEventListener('transitionend', dummyListener);
  }
  $deleteModal.addEventListener('transitionend', dummyListener);
  $deleteModal.classList.remove('modal-screen-transition');
}

function handleModalConfirm(event) {
  var removalEntryId = data.editing.entryId; // number type
  // delete from data
  var entriesRemovalIdx = data.entries.findIndex(obj => obj.entryId === removalEntryId);
  data.entries.splice(entriesRemovalIdx, 1);
  // delete from DOM tree
  var $elToRemove = $entriesList.querySelector('[data-entry-id="' + removalEntryId + '"]');
  $elToRemove.remove();

  switchToView(event.target.getAttribute('data-view'));
  $deleteModal.classList.remove('modal-screen-transition');
  $deleteModal.classList.add('hidden');
}

function toggleDarkMode(event) {
  var $html = document.querySelector('html');
  var $toggleDiv = event.target.closest('div#dark-mode-toggle');
  var $toggleIcon = $toggleDiv.querySelector('i');
  var $toggleText = $toggleDiv.querySelector('p');
  var faLightIcon = 'fa-regular fa-sun';
  var faDarkIcon = 'fa-solid fa-moon';

  if ($html.classList.contains('light')) {
    // light to dark
    $html.classList.remove('light');
    $html.classList.add('dark');
    $toggleIcon.className = faDarkIcon;
    // $toggleIcon.classList.remove(faLightIcon);
    // $toggleIcon.classList.add(faDarkIcon);
    $toggleText.textContent = '\u00A0\u00A0Dark Mode'; // \u00A0 is &nbsp; for DOM
    // flash light on Dark Mode toggle
    $toggleDiv.classList.add('dark-mode-on-light');
    $toggleDiv.addEventListener('transitionend',
      event => event.target.classList.remove('dark-mode-on-light')
    );
  } else {
    // dark to light
    $html.classList.remove('dark');
    $html.classList.add('light');
    $toggleIcon.className = faLightIcon;
    $toggleText.textContent = '\u00A0\u00A0Light Mode';
  }
}

// Finish definitions

// Render all data for the first time
renderAllEntriesOnto(data.entries, $entriesList);

// Add Event Listeners
$photoURL.addEventListener('input', updatePhotoPreview);
$form.addEventListener('submit', saveFormData);

$logoNav.addEventListener('click', function (event) {
  switchToView(event.target.getAttribute('data-view'));
});
$entriesNav.addEventListener('click', function (event) {
  switchToView(event.target.getAttribute('data-view'));
});
$newEntry.addEventListener('click', function (event) {
  resetForm();
  switchToView(event.target.getAttribute('data-view'));
});

$entriesList.addEventListener('click', handleEditClick);

$deleteButton.addEventListener('click', handleDeleteClick);
$deleteModalCancel.addEventListener('click', handleModalCancel);
$deleteModalConfirm.addEventListener('click', handleModalConfirm);

$darkModeToggle.addEventListener('click', toggleDarkMode);

// Show the last view
switchToView(data.view);
