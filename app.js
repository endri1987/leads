import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ==========================
   SIDEBAR NAVIGATION
========================== */

const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

navButtons.forEach(button => {
  button.addEventListener("click", () => {

    navButtons.forEach(btn =>
      btn.classList.remove("active")
    );

    pages.forEach(page =>
      page.classList.remove("active-page")
    );

    button.classList.add("active");

    const section = document.getElementById(
      button.dataset.section
    );

    if (section) {
      section.classList.add("active-page");
    }

  });
});

/* ==========================
   MODAL
========================== */

const modal = document.getElementById("requestModal");

const openBtn1 =
  document.getElementById("openRequestModal");

const openBtn2 =
  document.getElementById("openRequestModal2");

const closeBtn =
  document.getElementById("closeRequestModal");

function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

openBtn1?.addEventListener("click", openModal);
openBtn2?.addEventListener("click", openModal);
closeBtn?.addEventListener("click", closeModal);

window.addEventListener("click", e => {
  if (e.target === modal) {
    closeModal();
  }
});

/* ==========================
   CREATE REQUEST
========================== */

const requestForm =
  document.getElementById("requestForm");

requestForm?.addEventListener(
  "submit",
  async e => {

    e.preventDefault();

    const clientName =
      document.getElementById("clientName").value;

    const clientPhone =
      document.getElementById("clientPhone").value;

    const clientAddress =
      document.getElementById("clientAddress").value;

    const projectDescription =
      document.getElementById("projectDescription").value;

    try {

      await addDoc(
        collection(db, "requests"),
        {
          clientName,
          clientPhone,
          clientAddress,
          projectDescription,
          status: "Pending",
          createdAt: serverTimestamp()
        }
      );

      requestForm.reset();

      closeModal();

      await loadRequests();

      alert("Request created successfully");

    } catch (error) {

      console.error(error);

      alert("Error creating request");

    }

  }
);

/* ==========================
   LOAD REQUESTS
========================== */

async function loadRequests() {

  const requestsTable =
    document.getElementById("requestsTable");

  const latestTable =
    document.getElementById("latestRequestsTable");

  if (requestsTable) {
    requestsTable.innerHTML = "";
  }

  if (latestTable) {
    latestTable.innerHTML = "";
  }

  let total = 0;
  let pending = 0;
  let approved = 0;
  let rejected = 0;
  let completed = 0;

  const requestsRef =
    collection(db, "requests");

  const q = query(
    requestsRef,
    orderBy("createdAt", "desc")
  );

  const snapshot =
    await getDocs(q);

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    total++;

    if (data.status === "Pending")
      pending++;

    if (data.status === "Approved")
      approved++;

    if (data.status === "Rejected")
      rejected++;

    if (data.status === "Completed")
      completed++;

    if (requestsTable) {

      requestsTable.innerHTML += `
        <tr>
          <td>${data.clientName || ""}</td>
          <td>${data.clientPhone || ""}</td>
          <td>${data.clientAddress || ""}</td>
          <td>${data.status || "Pending"}</td>
          <td>
            <button
              class="delete-btn"
              data-id="${docSnap.id}"
            >
              Delete
            </button>
          </td>
        </tr>
      `;
    }

    if (latestTable) {

      latestTable.innerHTML += `
        <tr>
          <td>${data.clientName || ""}</td>
          <td>${data.clientPhone || ""}</td>
          <td>${data.status || "Pending"}</td>
          <td>${new Date().toLocaleDateString()}</td>
        </tr>
      `;
    }

  });

  document.getElementById(
    "totalRequests"
  ).textContent = total;

  document.getElementById(
    "pendingRequests"
  ).textContent = pending;

  document.getElementById(
    "approvedRequests"
  ).textContent = approved;

  document.getElementById(
    "rejectedRequests"
  ).textContent = rejected;

  document.getElementById(
    "completedRequests"
  ).textContent = completed;

  setupDeleteButtons();
}

/* ==========================
   DELETE REQUEST
========================== */

function setupDeleteButtons() {

  const deleteButtons =
    document.querySelectorAll(".delete-btn");

  deleteButtons.forEach(button => {

    button.addEventListener(
      "click",
      async () => {

        const confirmed =
          confirm(
            "Delete this request?"
          );

        if (!confirmed) return;

        try {

          await deleteDoc(
            doc(
              db,
              "requests",
              button.dataset.id
            )
          );

          await loadRequests();

        } catch (error) {

          console.error(error);

          alert(
            "Failed to delete request"
          );

        }

      }
    );

  });

}

/* ==========================
   INITIAL LOAD
========================== */

loadRequests();
/* ==========================
   CONTRACTOR MODAL
========================== */

const contractorModal =
  document.getElementById("contractorModal");

const openContractorModal =
  document.getElementById("openContractorModal");

const closeContractorModal =
  document.getElementById("closeContractorModal");

openContractorModal?.addEventListener(
  "click",
  () => {
    contractorModal.style.display = "flex";
  }
);

closeContractorModal?.addEventListener(
  "click",
  () => {
    contractorModal.style.display = "none";
  }
);

window.addEventListener("click", e => {
  if (e.target === contractorModal) {
    contractorModal.style.display = "none";
  }
});
/* ==========================
   CREATE CONTRACTOR
========================== */

const contractorForm =
  document.getElementById("contractorForm");

contractorForm?.addEventListener(
  "submit",
  async e => {

    e.preventDefault();

    try {

      await addDoc(
        collection(db, "contractors"),
        {
          name:
            document.getElementById("contractorName").value,

          email:
            document.getElementById("contractorEmail").value,

          phone:
            document.getElementById("contractorPhone").value,

          serviceArea:
            document.getElementById("contractorArea").value,

          services:
            document.getElementById("contractorServices").value,

          status:
            document.getElementById("contractorStatus").value,

          notes:
            document.getElementById("contractorNotes").value,

          createdAt:
            serverTimestamp()
        }
      );

      contractorForm.reset();

      contractorModal.style.display = "none";

      await loadContractors();

      alert(
        "Contractor saved successfully"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to save contractor"
      );

    }

  }
);
/* ==========================
   LOAD CONTRACTORS
========================== */

async function loadContractors() {

  const contractorsTable =
    document.getElementById(
      "contractorsTable"
    );

  if (!contractorsTable) return;

  contractorsTable.innerHTML = "";

  const contractorsRef =
    collection(db, "contractors");

  const q = query(
    contractorsRef,
    orderBy("createdAt", "desc")
  );

  const snapshot =
    await getDocs(q);

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    contractorsTable.innerHTML += `
      <tr>
        <td>${data.name || ""}</td>
        <td>${data.phone || ""}</td>
        <td>${data.email || ""}</td>
        <td>${data.serviceArea || ""}</td>
        <td>${data.services || ""}</td>
        <td>${data.status || ""}</td>
      </tr>
    `;

  });

}
loadContractors();
/* ==========================
   QUOTE MODAL
========================== */

const quoteModal =
  document.getElementById("quoteModal");

const openQuoteModal =
  document.getElementById("openQuoteModal");

const closeQuoteModal =
  document.getElementById("closeQuoteModal");

openQuoteModal?.addEventListener(
  "click",
  () => {
    quoteModal.style.display = "flex";
  }
);

closeQuoteModal?.addEventListener(
  "click",
  () => {
    quoteModal.style.display = "none";
  }
);

window.addEventListener("click", e => {
  if (e.target === quoteModal) {
    quoteModal.style.display = "none";
  }
});
/* ==========================
   CREATE QUOTE
========================== */

const quoteForm =
  document.getElementById("quoteForm");

quoteForm?.addEventListener(
  "submit",
  async e => {

    e.preventDefault();

    try {

      await addDoc(
        collection(db, "quotes"),
        {
          request:
            document.getElementById("quoteRequest").value,

          contractor:
            document.getElementById("quoteContractor").value,

          price:
            Number(
              document.getElementById("quotePrice").value
            ),

          status:
            document.getElementById("quoteStatus").value,

          createdAt:
            serverTimestamp()
        }
      );

      quoteForm.reset();

      quoteModal.style.display = "none";

      await loadQuotes();

      alert(
        "Quote saved successfully"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to save quote"
      );

    }

  }
);
/* ==========================
   LOAD QUOTES
========================== */

async function loadQuotes() {

  const quotesTable =
    document.getElementById(
      "quotesTable"
    );

  if (!quotesTable) return;

  quotesTable.innerHTML = "";

  const quotesRef =
    collection(db, "quotes");

  const q = query(
    quotesRef,
    orderBy("createdAt", "desc")
  );

  const snapshot =
    await getDocs(q);

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    quotesTable.innerHTML += `
      <tr>
        <td>${data.request || ""}</td>
        <td>${data.contractor || ""}</td>
        <td>€${data.price || 0}</td>
        <td>${data.status || ""}</td>
      </tr>
    `;

  });

}
loadQuotes();
/* ==========================
   LOAD COMMISSIONS
========================== */

async function loadCommissions() {

  const commissionsTable =
    document.getElementById(
      "commissionsTable"
    );

  if (!commissionsTable) return;

  commissionsTable.innerHTML = "";

  const quotesRef =
    collection(db, "quotes");

  const q = query(
    quotesRef,
    orderBy("createdAt", "desc")
  );

  const snapshot =
    await getDocs(q);

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    const price =
      Number(data.price || 0);

    const commissionPercent = 15;

    const commissionAmount =
      (price * commissionPercent) / 100;

    commissionsTable.innerHTML += `
      <tr>
        <td>${data.request || ""}</td>
        <td>${data.contractor || ""}</td>
        <td>€${price}</td>
        <td>${commissionPercent}%</td>
        <td>€${commissionAmount}</td>
      </tr>
    `;

  });

}
loadCommissions();