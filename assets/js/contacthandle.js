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

// Dynamically pick API base URL
const apiBaseUrl = window.location.origin; 
// So if you open from localhost, it will pick localhost, 
// if you open live, it will pick https://ybtcuk.com

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Prepare data from form
  const data = {
    fullName: document.getElementById("fullName").value,
    phone: document.getElementById("phone").value,
    orgName: document.getElementById("orgName").value,
    companySize:
      document.getElementById("companySize").value === "Other"
        ? document.getElementById("companySizeOther").value
        : document.getElementById("companySize").value,
    industry:
      document.getElementById("industry").value === "Other"
        ? document.getElementById("industryOther").value
        : document.getElementById("industry").value,
    timeline:
      document.getElementById("timeline").value === "Other"
        ? document.getElementById("timelineOther").value
        : document.getElementById("timeline").value,
    contactMethod:
      document.getElementById("contactMethod").value === "Other"
        ? document.getElementById("contactMethodOther").value
        : document.getElementById("contactMethod").value,
    message: document.getElementById("message").value,
  };

  try {
    // Send POST request to backend
    const res = await fetch(`${apiBaseUrl}/send-consultation`, {
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
