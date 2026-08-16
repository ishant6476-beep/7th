(() => {
  "use strict";
  const form = document.getElementById("eduForm");
  const status = document.getElementById("formStatus");
  const submit = document.getElementById("submitButton");

  form.addEventListener("submit", async event => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";
    const data = new FormData(form);
    const categories = data.getAll("course_categories");
    if (!categories.length) {
      status.className = "form-status error";
      status.textContent = "Please select at least one course category for availability checking.";
      form.querySelector(".course-grid").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const fields = {};
    for (const [key, value] of data.entries()) {
      if (!["course_categories", "consent", "website_confirm"].includes(key)) fields[key] = String(value).trim();
    }
    fields.course_categories = categories;
    submit.disabled = true;
    submit.textContent = "Submitting securely…";
    try {
      const response = await fetch("/api/college-inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: fields, consent: data.get("consent") === "on", website_confirm: data.get("website_confirm") || "" }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "The consultation could not be submitted.");
      status.className = "form-status success";
      status.innerHTML = `<strong>Consultation request received.</strong><br>Reference: ${result.reference}. Our EduEx team can contact you using the details provided.`;
      form.reset();
      status.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (error) {
      status.className = "form-status error";
      status.textContent = error.message;
    } finally {
      submit.disabled = false;
      submit.textContent = "Submit college consultation";
    }
  });
})();
