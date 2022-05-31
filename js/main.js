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
