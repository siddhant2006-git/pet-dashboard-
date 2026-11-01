// demo data
let users = JSON.parse(localStorage.getItem("users")) || [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    role: "Pet Owner",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Verma",
    email: "priya@gmail.com",
    role: "Pet Owner",
    status: "Active",
  },
];

let appointments = JSON.parse(localStorage.getItem("appointments")) || [
  {
    id: 1,
    pet: "Bruno",
    owner: "Rahul Sharma",
    provider: "Dr. Amit",
    service: "Veterinary Checkup",
    date: "2026-11-05",
    status: "Pending",
  },
  {
    id: 2,
    pet: "Max",
    owner: "Priya Verma",
    provider: "Dr. Neha",
    service: "Grooming",
    date: "2026-11-06",
    status: "Approved",
  },
];

let services = JSON.parse(localStorage.getItem("services")) || [
  {
    id: 1,
    name: "Veterinary Checkup",
    price: 500,
    status: "Active",
  },
  {
    id: 2,
    name: "Pet Grooming",
    price: 800,
    status: "Active",
  },
];

let providers = JSON.parse(localStorage.getItem("providers")) || [
  {
    id: 1,
    name: "Dr. Amit Kumar",
    email: "amit@gmail.com",
    specialty: "Veterinarian",
    status: "Active",
  },
  {
    id: 2,
    name: "Dr. Neha Singh",
    email: "neha@gmail.com",
    specialty: "Pet Groomer",
    status: "Active",
  },
];

// Save Data in Local Storage

function saveData() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("appointments", JSON.stringify(appointments));
  localStorage.setItem("services", JSON.stringify(services));
  localStorage.setItem("providers", JSON.stringify(providers));
}

// Navigation

const navButtons = document.querySelectorAll("[data-page]");
const view = document.getElementById("view");
const crumb = document.getElementById("crumb");

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const page = button.dataset.page;
    showPage(page);

    navButtons.forEach((item) => {
      item.classList.remove("active");
      item.removeAttribute("aria-current");
    });

    button.classList.add("active");
    button.setAttribute("aria-current", "page");
  });
});

view.addEventListener("click", (event) => {
  const pageButton = event.target.closest("[data-open-page]");
  if (!pageButton) return;

  const page = pageButton.dataset.openPage;
  showPage(page);

  navButtons.forEach((button) => {
    const isCurrentPage = button.dataset.page === page;
    button.classList.toggle("active", isCurrentPage);

    if (isCurrentPage) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });
});

function showPage(page) {
  if (!view) return;

  if (crumb) {
    crumb.textContent = page.charAt(0).toUpperCase() + page.slice(1);
  }

  switch (page) {
    case "dashboard":
      showDashboard();
      break;

    case "appointments":
      showAppointments();
      break;

    case "users":
      showUsers();
      break;

    case "providers":
      showProviders();
      break;

    case "services":
      showServices();
      break;

    default:
      showDashboard();
  }
}

//Dashboard

function showDashboard() {
  const statuses = ["Pending", "Approved", "Completed", "Cancelled", "Rejected"];
  const statusCount = (status) =>
    appointments.filter((item) => item.status === status).length;
  const totalAppointments = appointments.length;
  const recentAppointments = appointments.slice(-5).reverse();

  view.innerHTML = `
        <section class="dashboard-hero">
            <div>
                <p class="eyebrow">YOUR PET CARE COMMUNITY</p>
                <h1>Welcome back, Admin <span aria-hidden="true">✦</span></h1>
                <p class="hero-copy">Here’s a look at how things are going today.</p>
            </div>
            <button type="button" class="btn primary" data-open-page="appointments">
                Review appointments <span aria-hidden="true">→</span>
            </button>
        </section>

        <section class="stats" aria-label="Dashboard statistics">
            <article class="stat">
                <label>Total users <i aria-hidden="true">♙</i></label>
                <b>${users.length}</b>
                <small class="stat-note">In your community</small>
            </article>
            <article class="stat">
                <label>Service providers <i aria-hidden="true">✚</i></label>
                <b>${providers.length}</b>
                <small class="stat-note">Care professionals</small>
            </article>
            <article class="stat">
                <label>Appointments <i aria-hidden="true">▦</i></label>
                <b>${totalAppointments}</b>
                <small class="stat-note">All-time bookings</small>
            </article>
            <article class="stat">
                <label>Services <i aria-hidden="true">◇</i></label>
                <b>${services.length}</b>
                <small class="stat-note">Available in your catalog</small>
            </article>
        </section>

        <div class="grid dashboard-grid">
            <section class="panel dashboard-panel">
                <div class="panel-head">
                    <div>
                        <h2>Recent appointments</h2>
                        <p>Your latest bookings from pet families</p>
                    </div>
                    <button type="button" class="link-button" data-open-page="appointments">
                        View all <span aria-hidden="true">→</span>
                    </button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Pet</th>
                                <th>Owner</th>
                                <th>Service</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${recentAppointments
                              .map(
                                (item) => `
                                <tr>
                                    <td><span class="pet-name">${item.pet}</span></td>
                                    <td>${item.owner}</td>
                                    <td>${item.service}</td>
                                    <td>${item.date}</td>
                                    <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
                                </tr>
                            `,
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
            </section>

            <aside class="panel status-panel">
                <div class="panel-head">
                    <div>
                        <h2>Appointment status</h2>
                        <p>A snapshot of your bookings</p>
                    </div>
                    <span class="status-mark" aria-hidden="true">↗</span>
                </div>
                <div class="status-list">
                    ${statuses
                      .map((status) => {
                        const amount = statusCount(status);
                        const percentage = totalAppointments
                          ? Math.round((amount / totalAppointments) * 100)
                          : 0;

                        return `
                            <div class="status-row">
                                <span>${status}</span>
                                <div
                                    class="track"
                                    role="progressbar"
                                    aria-label="${status} appointments"
                                    aria-valuemin="0"
                                    aria-valuemax="${totalAppointments}"
                                    aria-valuenow="${amount}"
                                >
                                    <span class="fill ${status.toLowerCase()}" style="width: ${percentage}%"></span>
                                </div>
                                <b>${amount}</b>
                            </div>
                        `;
                      })
                      .join("")}
                </div>
                <div class="status-footer">
                    <span>${statusCount("Pending")} need your attention</span>
                    <button type="button" class="link-button" data-open-page="appointments">Manage bookings →</button>
                </div>
            </aside>
        </div>

        <footer class="dashboard-footer">
            <span>Made for healthier, happier pets <b aria-hidden="true">♥</b></span>
            <span>Demo data is saved in this browser</span>
        </footer>
    `;
}

// Appointment Management

function showAppointments() {
  view.innerHTML = `
        <h2>Manage Appointments</h2>

        <input
            type="text"
            id="appointmentSearch"
            placeholder="Search appointments..."
        >

        <select id="appointmentFilter">
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
        </select>

        <div id="appointmentTable"></div>
    `;

  document
    .getElementById("appointmentSearch")
    .addEventListener("input", filterAppointments);

  document
    .getElementById("appointmentFilter")
    .addEventListener("change", filterAppointments);

  filterAppointments();
}

function filterAppointments() {
  const search = document
    .getElementById("appointmentSearch")
    .value.toLowerCase();

  const status = document.getElementById("appointmentFilter").value;

  const filtered = appointments.filter((item) => {
    const matchesSearch =
      item.pet.toLowerCase().includes(search) ||
      item.owner.toLowerCase().includes(search);

    const matchesStatus = status === "All" || item.status === status;

    return matchesSearch && matchesStatus;
  });

  document.getElementById("appointmentTable").innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Pet</th>
                    <th>Owner</th>
                    <th>Provider</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                ${filtered
                  .map(
                    (item) => `
                    <tr>
                        <td>${item.pet}</td>
                        <td>${item.owner}</td>
                        <td>${item.provider}</td>
                        <td>${item.service}</td>
                        <td>${item.date}</td>
                        <td>${item.status}</td>
                        <td>
                            <button onclick="updateAppointment(${item.id}, 'Approved')">
                                Approve
                            </button>

                            <button onclick="updateAppointment(${item.id}, 'Completed')">
                                Complete
                            </button>

                            <button onclick="updateAppointment(${item.id}, 'Cancelled')">
                                Cancel
                            </button>
                        </td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

function updateAppointment(id, status) {
  appointments = appointments.map((item) => {
    if (item.id === id) {
      return { ...item, status: status };
    }

    return item;
  });

  saveData();
  showAppointments();
  showToast("Appointment updated successfully!");
}

//User Management

function showUsers() {
  view.innerHTML = `
        <h2>Manage Users</h2>

        <input
            type="text"
            id="userSearch"
            placeholder="Search users..."
        >

        <div id="userTable"></div>
    `;

  document.getElementById("userSearch").addEventListener("input", filterUsers);

  filterUsers();
}

function filterUsers() {
  const search = document.getElementById("userSearch").value.toLowerCase();

  const filtered = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search),
  );

  document.getElementById("userTable").innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                ${filtered
                  .map(
                    (user) => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${user.status}</td>
                        <td>
                            <button onclick="toggleUser(${user.id})">
                                ${user.status === "Active" ? "Deactivate" : "Activate"}
                            </button>

                            <button onclick="deleteUser(${user.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

function toggleUser(id) {
  users = users.map((user) => {
    if (user.id === id) {
      user.status = user.status === "Active" ? "Inactive" : "Active";
    }

    return user;
  });

  saveData();
  showUsers();
  showToast("User status updated!");
}

function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) {
    return;
  }

  users = users.filter((user) => user.id !== id);

  saveData();
  showUsers();
  showToast("User deleted successfully!");
}

// 7. Provider Management

function showProviders() {
  view.innerHTML = `
        <h2>Manage Providers</h2>

        <div id="providerTable"></div>
    `;

  document.getElementById("providerTable").innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Specialty</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                ${providers
                  .map(
                    (provider) => `
                    <tr>
                        <td>${provider.name}</td>
                        <td>${provider.email}</td>
                        <td>${provider.specialty}</td>
                        <td>${provider.status}</td>
                        <td>
                            <button onclick="toggleProvider(${provider.id})">
                                ${provider.status === "Active" ? "Deactivate" : "Activate"}
                            </button>
                        </td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

function toggleProvider(id) {
  providers = providers.map((provider) => {
    if (provider.id === id) {
      provider.status = provider.status === "Active" ? "Inactive" : "Active";
    }

    return provider;
  });

  saveData();
  showProviders();
  showToast("Provider status updated!");
}

// 8. Service Management

function showServices() {
  view.innerHTML = `
        <h2>Manage Services</h2>

        <button onclick="addService()">
            Add New Service
        </button>

        <div id="serviceTable"></div>
    `;

  document.getElementById("serviceTable").innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Service Name</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                ${services
                  .map(
                    (service) => `
                    <tr>
                        <td>${service.name}</td>
                        <td>₹${service.price}</td>
                        <td>${service.status}</td>
                        <td>
                            <button onclick="editService(${service.id})">
                                Edit
                            </button>

                            <button onclick="toggleService(${service.id})">
                                ${service.status === "Active" ? "Disable" : "Enable"}
                            </button>

                            <button onclick="deleteService(${service.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

function addService() {
  const name = prompt("Enter service name:");

  if (!name || !name.trim()) {
    return;
  }

  const price = Number(prompt("Enter service price:"));

  if (!Number.isFinite(price) || price < 0) {
    showToast("Please enter a valid price.");
    return;
  }

  services.push({
    id: Date.now(),
    name: name.trim(),
    price: price,
    status: "Active",
  });

  saveData();
  showServices();
  showToast("Service added successfully!");
}

function editService(id) {
  const service = services.find((item) => item.id === id);

  if (!service) return;

  const name = prompt("Enter new service name:", service.name);

  if (!name || !name.trim()) return;

  const price = Number(prompt("Enter new price:", service.price));

  if (!Number.isFinite(price) || price < 0) {
    showToast("Please enter a valid price.");
    return;
  }

  service.name = name.trim();
  service.price = price;

  saveData();
  showServices();
  showToast("Service updated successfully!");
}

function toggleService(id) {
  services = services.map((service) => {
    if (service.id === id) {
      service.status = service.status === "Active" ? "Inactive" : "Active";
    }

    return service;
  });

  saveData();
  showServices();
  showToast("Service status updated!");
}

function deleteService(id) {
  if (!confirm("Are you sure you want to delete this service?")) {
    return;
  }

  services = services.filter((service) => service.id !== id);

  saveData();
  showServices();
  showToast("Service deleted successfully!");
}

// 9. Toast Notification

function showToast(message) {
  const toastContainer = document.getElementById("toasts");

  if (!toastContainer) {
    alert(message);
    return;
  }

  const toast = document.createElement("div");

  toast.className = "toast";
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// 10. Sidebar Mobile Menu

const menuButton = document.getElementById("menu");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

if (menuButton && sidebar) {
  menuButton.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));

    if (overlay) {
      overlay.classList.toggle("show", isOpen);
    }
  });
}

if (overlay) {
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

// 11. Display Current Date

const dateElement = document.getElementById("date");

if (dateElement) {
  const today = new Date();
  dateElement.dateTime = today.toISOString().slice(0, 10);
  dateElement.textContent = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// 12. Load Dashboard

saveData();
showDashboard();
