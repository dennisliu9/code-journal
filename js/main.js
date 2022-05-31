/* global data */

// Handle form
var $form = document.querySelector('#entry-area');
var $photo = document.querySelector('#input-img');
var $photoURL = document.querySelector('#photo-url');

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
}

$photoURL.addEventListener('input', updatePhotoPreview);
$form.addEventListener('submit', saveFormData);

// Render journal entries
var $entriesList = document.querySelector('#entries-list');

function renderEntry(entryObj) {
  /* -- Sample Entry HTML --
  <li data-entry-id=[entryObj.entryId]>
    <div class="row">
      <div class="column-half flex-col justify-center">
        <img src=[entryObj.photoURL] alt="User selected image">
      </div>
      <div class="column-half">
        <h2>[entryObj.title]</h2>
        <p class="font-regular">
          [entryObj.notes]
        </p>
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
  $txtCol.className = 'column-half';

  var $entryPhoto = document.createElement('img');
  $entryPhoto.setAttribute('src', entryObj.photoURL);
  $entryPhoto.setAttribute('alt', 'User selected image');

  var $entryTitle = document.createElement('h2');
  $entryTitle.textContent = entryObj.title;
  var $entryNotes = document.createElement('p');
  $entryNotes.textContent = entryObj.notes;
  $entryNotes.className = 'font-regular';

  $txtCol.appendChild($entryTitle);
  $txtCol.appendChild($entryNotes);
  $imgCol.appendChild($entryPhoto);

  $entryRow.appendChild($imgCol);
  $entryRow.appendChild($txtCol);

  $entryLi.appendChild($entryRow);

  return $entryLi;
}

for (var entryIdx = 0; entryIdx < data.entries.length; entryIdx++) {
  var $entryTree = renderEntry(data.entries[entryIdx]);
  $entriesList.appendChild($entryTree);
}
