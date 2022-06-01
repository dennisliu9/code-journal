/* global data */

// DOM elements to handle form
var $form = document.querySelector('#entry-area');
var $photo = document.querySelector('#input-img');
var $photoURL = document.querySelector('#photo-url');

// DOM elements to toggle between entry form and entries
var $views = document.querySelectorAll('div[data-view]');
var $entriesNav = document.querySelector('#entries-nav');
var $newEntry = document.querySelector('#new-entry-button');

// Handle form (functions and event listeners)
function updatePhotoPreview(event) {
  if ($photoURL.value !== '') {
    $photo.setAttribute('src', $photoURL.value);
    $photo.setAttribute('alt', 'User selected image');
  } else {
    $photo.setAttribute('src', 'images/placeholder-image-square.jpg');
    $photo.setAttribute('alt', 'placeholder image');
  }
}

function saveFormData(event) {
  event.preventDefault();
  var formData = {
    entryId: data.nextEntryId,
    title: $form.elements.entryTitle.value,
    photoURL: $form.elements.photoURL.value,
    notes: $form.elements.entryNotes.value
  };
  data.entries.unshift(formData);
  data.nextEntryId++;
  // reset form and image
  $form.reset();
  updatePhotoPreview(null);
  // show entries
  switchToView($views, 'entries');
}

$photoURL.addEventListener('input', updatePhotoPreview);
$form.addEventListener('submit', saveFormData);

// Render Entries (functions and event listeners)

// Render journal entries according to sample HTML, get data from entryObj
function renderEntry(entryObj) {
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
        <i class="fa-solid fa-pen color-accent edit-icon-pos"></i>
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
  var $editIcon = document.createElement('i');
  $editIcon.className = 'fa-solid fa-pen color-accent edit-icon-pos';

  $txtCol.appendChild($entryTitle);
  $txtCol.appendChild($entryNotes);
  $txtCol.appendChild($editIcon);
  $imgCol.appendChild($entryPhoto);

  $entryRow.appendChild($imgCol);
  $entryRow.appendChild($txtCol);

  $entryLi.appendChild($entryRow);

  return $entryLi;
}

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
function switchToView(views, dataViewToShow) {
  for (var vwIdx = 0; vwIdx < views.length; vwIdx++) {
    if (views[vwIdx].getAttribute('data-view') !== dataViewToShow) {
      views[vwIdx].className = 'hidden';
    } else {
      views[vwIdx].className = '';
    }
  }
  if (dataViewToShow === 'entries') {
    var $entriesList = document.querySelector('#entries-list');
    // $entriesList.replaceChildren();
    if (data.entries.length === 0) {
      var $blankEntriesText = document.createElement('p');
      $blankEntriesText.textContent = 'No entries have been recorded.';
      $blankEntriesText.className = 'body-font font-regular text-center';
      $entriesList.appendChild($blankEntriesText);
    }
    for (var entryIdx = 0; entryIdx < data.entries.length; entryIdx++) {
      var $entryTree = renderEntry(data.entries[entryIdx]);
      $entriesList.appendChild($entryTree);
    }
  }
  data.view = dataViewToShow;
}

$entriesNav.addEventListener('click', function (event) {
  switchToView($views, 'entries');
});
$newEntry.addEventListener('click', function (event) {
  switchToView($views, 'entry-form');
});

// Edit Button Capabilities
var $entriesList = document.querySelector('#entries-list');
function handleEditClick(event) {
  // console.log('event.target.tagName', event.target.tagName);
  if (event.target.tagName === 'I') {
    switchToView($views, 'entry-form');
  }
}

$entriesList.addEventListener('click', handleEditClick);

// Show the previous view at the end of the code
switchToView($views, data.view);
