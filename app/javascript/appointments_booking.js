document.addEventListener("DOMContentLoaded", () => {
const freeSlotsContainer = document.getElementById("free-slots");
const appointmentsList = document.getElementById("appointments-list");
const feedbackBox = document.getElementById("appointments-feedback");

if (!freeSlotsContainer || !appointmentsList) return;

const createUrl = freeSlotsContainer.dataset.createUrl;
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

function showFeedback(message, isError = false) {
if (!feedbackBox) return;
feedbackBox.textContent = message;
feedbackBox.dataset.status = isError ? "error" : "success";
}

function appendAppointmentRow(data) {
const row = document.createElement("div");
row.className = "appointment-row";

const patientName = data.patient_name || data.patient?.name || "Patient";
const startsAt = data.starts_at || "";
const status = data.status || "booked";

const info = document.createElement("p");

const p1 = document.createElement("strong");
p1.textContent = "Patient: ";
const p1Val = document.createTextNode(patientName + " | ");

const p2 = document.createElement("strong");
p2.textContent = "Starts at: ";
const p2Val = document.createTextNode(startsAt + " | ");

const p3 = document.createElement("strong");
p3.textContent = "Status: ";
const p3Val = document.createTextNode(status);

info.append(p1, p1Val, p2, p2Val, p3, p3Val);
row.appendChild(info);



appointmentsList.appendChild(row);
}

function escapeHtml(value) {
return String(value)
.replaceAll("&", "&")
.replaceAll("<", "<")
.replaceAll(">", ">")
.replaceAll("'", "&#39;")
.replaceAll("'", "'");
}

freeSlotsContainer.addEventListener("click", async (event) => {
const button = event.target.closest(".book-slot-btn");
if (!button) return;

const startsAt = button.dataset.startsAt;
const slotRow = button.closest(".free-slot-row");
const originalLabel = button.textContent;

button.disabled = true;
button.setAttribute("aria-busy", "true");
button.textContent = "Booking...";
showFeedback("");

try {
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  const response = await fetch(createUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      appointment: {
        starts_at: startsAt,
        status: "booked"
      }
    })
  });

  const payload = await response.json().catch(() => { return {}; });
  if (!response.ok) {
    const errorMessage =
      payload.error ||
      (Array.isArray(payload.errors) ? payload.errors.join(", ") : null) ||
      "Could not book this slot. It may already be taken.";
    throw new Error(errorMessage);
  }

  appendAppointmentRow(payload);
  if (slotRow) {
    slotRow.remove();
  }
  showFeedback("Appointment booked successfully.", false);
} catch (error) {
  button.disabled = false;
  button.removeAttribute("aria-busy");
  button.textContent = originalLabel;
  showFeedback(error.message || "Network error while booking appointment.", true);
}
});
});
