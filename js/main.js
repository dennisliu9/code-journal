var $form = document.querySelector('#entry-area');
var $photo = document.querySelector('#input-img');
var $photoURL = document.querySelector('#photo-url');

function updatePhotoPreview(event) {
  // test image (pikachu doing a ✌): https://i.pinimg.com/736x/5c/17/aa/5c17aa712336ec66a892e290f4504a44.jpg
  if ($form.elements.photoURL.value !== '') {
    $photo.setAttribute('src', $form.elements.photoURL.value);
    $photo.setAttribute('alt', 'User selected image');
  } else {
    $photo.setAttribute('src', 'images/placeholder-image-square.jpg');
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

  // reset
  $photo.setAttribute('src', 'images/placeholder-image-square.jpg');
  $photo.setAttribute('alt', 'placeholder image');
  $form.reset();
}

$photoURL.addEventListener('input', updatePhotoPreview);
$form.addEventListener('submit', saveFormData);
