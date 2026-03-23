import { useEffect, useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import { getPublicName, getUserId } from "../../../../session/sessionManager";
import { setValidationResult } from "../../../Form/FormValidation";
import FormRow from "../../../Form/FormRow";
import FlashMessage from "../../../FlashMessage/FlashMessage";

export default function ProfileForm() {
  const [loading, data, errors, makeRequest] = useFetch();
  const [publicName, setPublicName] = useState(getPublicName);
  const [description, setDescription] = useState("");

  useEffect(() => {
    makeRequest(`/users/${getUserId()}/profile/`);
  }, [makeRequest]);

  useEffect(() => {
    setTimeout(() => {
      if (data && data.publicName) {
        setPublicName(data.publicName);
        setDescription(data.description || "");
      }
    });
  }, [data]);

  function onPublicNameChange(event) {
    const publicNameElem = event.target;
    setPublicName(publicNameElem.value);

    validatePublicName(event);
  }

  function validatePublicName() {
    const publicNameElem = document.querySelector("input#public-name");
    if (publicNameElem.validity.valueMissing) {
      setValidationResult(publicNameElem, "Public name is required.");
    } else if (publicNameElem.value.trim() === "") {
      setValidationResult(publicNameElem, "Public name is required.");
    } else if (publicNameElem.validity.tooLong) {
      setValidationResult(
        publicNameElem,
        "Public name can't be longer than 30 characters.",
      );
    } else if (publicNameElem.validity.tooShort) {
      setValidationResult(
        publicNameElem,
        "Public name must be at least 4 characters.",
      );
    } else {
      setValidationResult(publicNameElem, "");
      return true;
    }

    return false;
  }

  function onDescriptionChange(event) {
    const descriptionElem = event.target;
    setDescription(descriptionElem.value);

    validateDescription(event);
  }

  function validateDescription() {
    const descriptionElem = document.querySelector("input#description");

    if (descriptionElem.validity.valueMissing) {
      setValidationResult(descriptionElem, "Description is required.");
    } else if (descriptionElem.validity.tooLong) {
      setValidationResult(
        descriptionElem,
        "Description can't be longer than 500 characters.",
      );
    } else if (descriptionElem.value.trim() === "") {
      setValidationResult(descriptionElem, "Description is required.");
    } else {
      setValidationResult(descriptionElem, "");
      return true;
    }

    return false;
  }

  function onSubmitClick() {
    validatePublicName();
    validateDescription();
  }

  function onSubmit(event) {
    event.preventDefault();

    const validPublicName = validatePublicName();
    const validDescription = validateDescription();

    if (!validPublicName || !validDescription) {
      return false;
    }

    const formData = new FormData(event.target);

    makeRequest("/users/profile", "PUT", true, Object.fromEntries(formData));
  }

  return (
    <div className="form-container">
      <form onSubmit={onSubmit} className="profile-form form">
        <h2>Profile</h2>
        <FormRow>
          <label htmlFor="public-name">Public name</label>
          <input
            type="text"
            name="public-name"
            id="public-name"
            value={publicName}
            onChange={onPublicNameChange}
            onBlur={validatePublicName}
            minLength={4}
            maxLength={30}
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
            onBlur={validateDescription}
            maxLength={500}
            required
          />
        </FormRow>
        <div className="buttons">
          <button type="submit" onClick={onSubmitClick} disabled={loading}>
            Submit
          </button>
        </div>
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
