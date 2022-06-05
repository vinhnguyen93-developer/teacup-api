document.addEventListener('DOMContentLoaded', function () {
  const inputFile = document.getElementById('myFile');
  const previewContainer = $('#imagePreview');
  const previewImage = $('.image-preview__image');

  inputFile.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      previewImage.css('display', 'block');
      reader.addEventListener('load', function () {
        previewImage.attr('src', this.result);
      });
      reader.readAsDataURL(file);
    }
  });
});
