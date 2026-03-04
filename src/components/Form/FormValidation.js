export function setValidationResult(elem, message) {
  const formRow = elem.closest(".form-row");
  const validationResultElem = formRow.querySelector(".validation-result");

  elem.setCustomValidity(message);
  validationResultElem.textContent = message;
}
