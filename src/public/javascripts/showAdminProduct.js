document.addEventListener('DOMContentLoaded', function () {
  let productId;
  const deleteForm = document.forms['delete-product-form'];
  const btnDeleteProduct = document.getElementById('btn-delete-product');
  const checkboxAll = $('#checkbox-all');
  const productItemCheckbox = $('input[name="courseIds[]"]');
  const checkAllSubmitBtn = $('.check-all-submit-btn');

  $('#delete-product-modal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget);
    productId = button.data('id');
  });

  btnDeleteProduct.onclick = function () {
    deleteForm.action = `/admin/products/${productId}?_method=DELETE`;
    deleteForm.submit();
  };

  checkboxAll.change(function () {
    var isCheckedAll = $(this).prop('checked');
    productItemCheckbox.prop('checked', isCheckedAll);
    renderCheckAllSubmitBtn();
  });

  productItemCheckbox.change(function () {
    var isCheckedAll = productItemCheckbox.length === $('input[name="courseIds[]"]:checked').length;
    checkboxAll.prop('checked', isCheckedAll);
    renderCheckAllSubmitBtn();
  });

  function renderCheckAllSubmitBtn() {
    var checkedCount = $('input[name="courseIds[]"]:checked').length;
    if (checkedCount > 0) {
      checkAllSubmitBtn.attr('disabled', false);
    } else {
      checkAllSubmitBtn.attr('disabled', true);
    }
  }
});
