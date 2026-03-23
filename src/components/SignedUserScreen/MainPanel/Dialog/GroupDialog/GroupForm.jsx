import { useState } from "react";
import useFetch from "../../../../../hooks/useFetch";
import { setValidationResult } from "../../../../Form/FormValidation";
import FormRow from "../../../../Form/FormRow";
import FlashMessage from "../../../../FlashMessage/FlashMessage";
import Loading from "../../../../Loading/Loading";

export default function GroupForm({
  currentName = null,
  currentDescription = null,
  id = null,
}) {
  const [loading, data, errors, makeRequest] = useFetch();
  const [name, setName] = useState(currentName || "");
  const [description, setDescription] = useState(currentDescription || "");

  function onNameChange(event) {
    const nameElem = event.target;
    setName(nameElem.value);

    validateName(event);
  }

  function validateName() {
    const nameElem = document.querySelector("input#name");
    if (nameElem.validity.valueMissing || nameElem.value.trim() === "") {
      setValidationResult(nameElem, "Name is required.");
    } else if (nameElem.validity.tooLong) {
      setValidationResult(nameElem, "Name can't be longer than 50 characters.");
    } else if (nameElem.validity.tooShort) {
      setValidationResult(nameElem, "Name must be at least 4 characters.");
    } else {
      setValidationResult(nameElem, "");
      return true;
    }

    return false;
  }

  function onDescriptionChange(event) {
    const descriptionElem = event.target;
    setDescription(descriptionElem.value);
  }

  function onSubmitClick() {
    validateName();
  }

  function onSubmit(event) {
    event.preventDefault();

    const validName = validateName();

    if (!validName) {
      return false;
    }

    const formData = new FormData(event.target);

    const method = isCreate ? "POST" : "PUT";

    makeRequest(
      `/groups/${isCreate ? "" : id}`,
      method,
      true,
      Object.fromEntries(formData),
    );
  }

  const isCreate =
    currentName === null && currentDescription === null && id === null;

  return (
    <div className="form-container">
      <form onSubmit={onSubmit} className="group-form form">
        <h2>Group</h2>
        <FormRow>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={onNameChange}
            onBlur={validateName}
            minLength={4}
            maxLength={50}
            required
          />
        </FormRow>

        <FormRow>
          <label htmlFor="description">Description</label>
          <input
            type="description"
            name="description"
            id="description"
            value={description}
            onChange={onDescriptionChange}
          />
        </FormRow>
        <div className="buttons">
          <button type="submit" onClick={onSubmitClick} disabled={loading}>
            {isCreate ? "Submit" : "Update"}
          </button>
        </div>
        {loading && <Loading size={3} />}
      </form>
      <div className="flash-messages">
        {errors.map((error, index) => (
          <FlashMessage message={error} type={"error"} key={index} />
        ))}
        {data !== null && typeof data.message !== "undefined" && (
          <FlashMessage message={data.message} type={"success"} />
        )}
      </div>
    </div>
  );
}
