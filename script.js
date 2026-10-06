const WORKSHOP_FEES = {
  "Web Development": 500,
  "UI/UX Design": 400,
  "Cybersecurity": 600
};

const SCHOLAR_DISCOUNT_RATE = 0.2;
const STUDENT_NUMBER_REGEX = /^\d{2}-\d{4}-\d{3}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidName(name) {
  if (typeof name !== "string") return false;
  const trimmed = name.trim();
  return trimmed.length >= 3 && !/\d/.test(trimmed);
}

function isValidStudentNumber(studentNumber) {
  return typeof studentNumber === "string" && STUDENT_NUMBER_REGEX.test(studentNumber);
}

function isValidEmail(email) {
  return typeof email === "string" && EMAIL_REGEX.test(email);
}

function validateStudentInfo(name, studentNumber, email) {
  return isValidName(name) && isValidStudentNumber(studentNumber) && isValidEmail(email);
}

function getBaseFee(workshop) {
  return Object.prototype.hasOwnProperty.call(WORKSHOP_FEES, workshop) ? WORKSHOP_FEES[workshop] : 0;
}

function calculateFinalFee(workshop, studentType) {
  const base = getBaseFee(workshop);
  return studentType === "Scholar" ? base - base * SCHOLAR_DISCOUNT_RATE : base;
}

function formatPeso(amount) {
  return "₱" + amount;
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    const byId = (id) => document.getElementById(id);

    const form = byId("registrationForm");
    const studentName = byId("studentName");
    const studentNumber = byId("studentNumber");
    const email = byId("email");
    const workshop = byId("workshop");
    const typeRegular = byId("studentTypeRegular");
    const typeScholar = byId("studentTypeScholar");
    const terms = byId("terms");
    const clearBtn = byId("clearBtn");

    const nameError = byId("nameError");
    const studentNumberError = byId("studentNumberError");
    const emailError = byId("emailError");
    const workshopError = byId("workshopError");
    const termsError = byId("termsError");

    const registrationFee = byId("registrationFee");
    const discount = byId("discount");
    const finalFee = byId("finalFee");
    const registrationResult = byId("registrationResult");

    const summaryName = byId("summaryName");
    const summaryStudentNumber = byId("summaryStudentNumber");
    const summaryEmail = byId("summaryEmail");
    const summaryWorkshop = byId("summaryWorkshop");
    const summaryStudentType = byId("summaryStudentType");
    const summaryFee = byId("summaryFee");
    const summaryDiscount = byId("summaryDiscount");
    const summaryFinalFee = byId("summaryFinalFee");

    const errorElements = [nameError, studentNumberError, emailError, workshopError, termsError];

    function getSelectedWorkshop() {
      if (Object.prototype.hasOwnProperty.call(WORKSHOP_FEES, workshop.value)) {
        return workshop.value;
      }
      const option = workshop.options[workshop.selectedIndex];
      const text = option ? option.textContent.trim() : "";
      return Object.prototype.hasOwnProperty.call(WORKSHOP_FEES, text) ? text : "";
    }

    function getSelectedStudentType() {
      if (typeScholar.checked) return "Scholar";
      if (typeRegular.checked) return "Regular Student";
      return "";
    }

    function renderFees(target) {
      const workshopName = getSelectedWorkshop();
      const base = getBaseFee(workshopName);
      const final = calculateFinalFee(workshopName, getSelectedStudentType());
      target.fee.textContent = formatPeso(base);
      target.discount.textContent = formatPeso(base - final);
      target.final.textContent = formatPeso(final);
    }

    function updateFeeDisplay() {
      renderFees({ fee: registrationFee, discount: discount, final: finalFee });
    }

    function resetFeeDisplay() {
      registrationFee.textContent = formatPeso(0);
      discount.textContent = formatPeso(0);
      finalFee.textContent = formatPeso(0);
    }

    function clearErrors() {
      errorElements.forEach(function (element) {
        element.textContent = "";
      });
    }

    function hideResult() {
      registrationResult.hidden = true;
    }

    function showResult() {
      registrationResult.hidden = false;
    }

    function showSummary() {
      summaryName.textContent = studentName.value.trim();
      summaryStudentNumber.textContent = studentNumber.value;
      summaryEmail.textContent = email.value;
      summaryWorkshop.textContent = getSelectedWorkshop();
      summaryStudentType.textContent = getSelectedStudentType() || "None";
      renderFees({ fee: summaryFee, discount: summaryDiscount, final: summaryFinalFee });
      showResult();
    }

    function validateForm() {
      let valid = true;

      if (!isValidName(studentName.value)) {
        nameError.textContent = "Enter a valid student name.";
        valid = false;
      }
      if (!isValidStudentNumber(studentNumber.value)) {
        studentNumberError.textContent = "Enter a valid student number.";
        valid = false;
      }
      if (!isValidEmail(email.value)) {
        emailError.textContent = "Enter a valid email address.";
        valid = false;
      }
      if (!getSelectedWorkshop()) {
        workshopError.textContent = "Please select a workshop.";
        valid = false;
      }
      if (!terms.checked) {
        termsError.textContent = "You must accept the Terms and Conditions.";
        valid = false;
      }

      return valid;
    }

    function resetForm() {
      studentName.value = "";
      studentNumber.value = "";
      email.value = "";
      workshop.selectedIndex = 0;
      typeRegular.checked = false;
      typeScholar.checked = false;
      terms.checked = false;
      clearErrors();
      resetFeeDisplay();
      hideResult();
    }

    hideResult();
    resetFeeDisplay();

    workshop.addEventListener("change", updateFeeDisplay);
    typeRegular.addEventListener("change", updateFeeDisplay);
    typeScholar.addEventListener("change", updateFeeDisplay);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors();
      hideResult();
      if (validateForm()) {
        showSummary();
      }
    });

    clearBtn.addEventListener("click", resetForm);
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { validateStudentInfo, calculateFinalFee };
}