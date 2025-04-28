// Helper function to toggle "Other" input fields
const toggleOtherInput = (selectId, inputId) => {
  const select = document.getElementById(selectId);
  const input = document.getElementById(inputId);
  select.addEventListener("change", () => {
    input.classList.toggle("d-none", select.value !== "Other");
  });
};

toggleOtherInput("companySize", "companySizeOther");
toggleOtherInput("industry", "industryOther");
toggleOtherInput("timeline", "timelineOther");
toggleOtherInput("contactMethod", "contactMethodOther");

// Get form and alert message elements
const form = document.getElementById("consultationForm");
const alertMsg = document.getElementById("alertMsg");

// Backend API URL (yless function)
const apiBaseUrl = "/api/send-consultation"; 

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Prepare data from form
  const data = {
    fullName: document.getElementById("fullName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    orgName: document.getElementById("orgName").value.trim(),
    companySize:
      document.getElementById("companySize").value === "Other"
        ? document.getElementById("companySizeOther").value.trim()
        : document.getElementById("companySize").value,
    industry:
      document.getElementById("industry").value === "Other"
        ? document.getElementById("industryOther").value.trim()
        : document.getElementById("industry").value,
    timeline:
      document.getElementById("timeline").value === "Other"
        ? document.getElementById("timelineOther").value.trim()
        : document.getElementById("timeline").value,
    contactMethod:
      document.getElementById("contactMethod").value === "Other"
        ? document.getElementById("contactMethodOther").value.trim()
        : document.getElementById("contactMethod").value,
    message: document.getElementById("message").value.trim(),
  };

  try {
    // Send POST request to backend
    const res = await fetch(apiBaseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      alertMsg.innerHTML = `<div class="alert alert-success">${result.message}</div>`;
      form.reset();
    } else {
      alertMsg.innerHTML = `<div class="alert alert-danger">Failed to send. Please try again later.</div>`;
    }
  } catch (err) {
    console.error("Error submitting form:", err);
    alertMsg.innerHTML = `<div class="alert alert-danger">Server Error. Please try again later.</div>`;
  }
});
