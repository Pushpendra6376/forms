document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#registrationForm");
  const tableBody = document.querySelector("tbody");
  const fileInput = document.getElementById("file");
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  const passwordField = document.getElementById("password");
  const passwordStrength = document.getElementById("passwordStrength");

  function refreshTable() {
    tableBody.innerHTML = "";
    const data = JSON.parse(localStorage.getItem("formData")) || [];
    data.forEach((entry, index) => addTableRow(entry, index));
  }

  function addTableRow(data, index) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.firstName}</td>
      <td>${data.lastName}</td>
      <td>${data.fullName}</td>
      <td>${data.dob}</td>
      <td>${data.gender}</td>
      <td>${data.age}</td>
      <td>${data.city}</td>
      <td>${data.email}</td>
      <td>
        <button style="background-color: yellow; color: black;" class="edit-btn" onclick="editRow(${index})">Edit</button>
        <button style="background-color: red; color: black;" class="delete-btn" onclick="deleteRow(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  }

  window.editRow = function (index) {
    const data = JSON.parse(localStorage.getItem("formData")) || [];
    const entry = data[index];
    form.firstName.value = entry.firstName;
    form.lastName.value = entry.lastName;
    form.fullName.value = entry.fullName;
    form.dob.value = entry.dob;
    form.age.value = entry.age;
    form.city.value = entry.city;
    form.email.value = entry.email;
    document.querySelector(`input[name='gender'][value='${entry.gender}']`).checked = true;

    data.splice(index, 1);
    localStorage.setItem("formData", JSON.stringify(data));
    refreshTable();
  };

  window.deleteRow = function (index) {
    const data = JSON.parse(localStorage.getItem("formData")) || [];
    data.splice(index, 1);
    localStorage.setItem("formData", JSON.stringify(data));
    refreshTable();
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const password = form.password.value.trim();
    const confirmPassword = form.confirmPassword.value.trim();
    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }

    const gender = form.querySelector("input[name='gender']:checked")?.value;
    const data = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      fullName: form.fullName.value.trim(),
      dob: form.dob.value.trim(),
      gender: gender,
      age: form.age.value,
      city: form.city.value,
      email: form.email.value
    };

    const existingData = JSON.parse(localStorage.getItem("formData")) || [];
    existingData.push(data);
    localStorage.setItem("formData", JSON.stringify(existingData));
    addTableRow(data, existingData.length - 1);
    form.reset();

    Swal.fire({
      icon: "success",
      title: "Application submitted successfully!",
      showConfirmButton: false,
      timer: 2000
    });
  });

  fileInput.addEventListener("change", () => {
    const fileName = fileInput.files[0]?.name || "No file selected";
    fileNameDisplay.textContent = `Selected File: ${fileName}`;
  });

  passwordField.addEventListener("input", () => {
    const val = passwordField.value;
    if (val.length < 6) {
      passwordStrength.textContent = "Weak Password";
      passwordStrength.style.color = "red";
    } else if (val.match(/[0-9]/) && val.match(/[A-Z]/) && val.length >= 8) {
      passwordStrength.textContent = "Strong Password";
      passwordStrength.style.color = "green";
    } else {
      passwordStrength.textContent = "Medium Strength";
      passwordStrength.style.color = "orange";
    }
  });

  refreshTable();
});
