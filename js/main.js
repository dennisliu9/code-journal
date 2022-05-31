
var $photoURL = document.querySelector('#photo-url');
var $photo = document.querySelector('#input-img');
// var $submitButton = document.querySelector('#save-button');

function updatePhotoPreview(event) {
  // test image: https://i.pinimg.com/736x/5c/17/aa/5c17aa712336ec66a892e290f4504a44.jpg (pikachu doing a ✌)
  if ($photoURL.value !== '') {
    $photo.setAttribute('src', $photoURL.value);
    $photo.setAttribute('alt', 'User image');
  } else {
    $photo.setAttribute('src', 'images/placeholder-image-square.jpg');
  }

}

$photoURL.addEventListener('input', updatePhotoPreview);
