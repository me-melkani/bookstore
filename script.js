/* script.js - beginner friendly JavaScript */

/* ---------- 1) Data: list of books ---------- */
/* Small list of books so we can show them on the home page */
let books = [
  { id: 1, title: "Learn C Programming", price: 299 },
  { id: 2, title: "Web Development Basics", price: 399 },
  { id: 3, title: "Data Structures in C", price: 499 },
  { id: 4, title: "JavaScript for Beginners", price: 599 }
];

/* ---------- 2) Home page: showBooks() ---------- */
/* This function finds the element with id 'book-list' and adds cards */
function showBooks() {
  // get the container where we will put book cards
  let list = document.getElementById("book-list");
  if (!list) return; // if container not on page, stop

  // clear previous content (safe)
  list.innerHTML = "";

  // for each book, create a simple HTML card
  books.forEach(function (b) {
    // card HTML (very simple)
    let card = `
      <div class="col-md-3">
        <div class="card h-100">
          <h5>${b.title}</h5>
          <p>Price: ₹${b.price}</p>
          <!-- pass book id in query string to payment page -->
          <a href="payment.html?id=${b.id}" class="btn btn-primary">Buy Now</a>
        </div>
      </div>
    `;
    // add card to the list
    list.innerHTML += card;
  });
}

/* ---------- 3) Register & Login (simple localStorage) ---------- */
/* Save user: key = email, value = password (demo only) */
function handleRegister(event) {
  event.preventDefault(); // stop page reload

  let name = document.getElementById("regName").value.trim();
  let email = document.getElementById("regEmail").value.trim().toLowerCase();
  let pass = document.getElementById("regPass").value;

  if (!name || !email || !pass) {
    document.getElementById("regMsg").innerText = "Please fill all fields.";
    return;
  }

  // store password in localStorage (demo only - not secure)
  localStorage.setItem("user_" + email, JSON.stringify({ name: name, pass: pass }));
  document.getElementById("regMsg").innerText = "Registered successfully. You can login now.";
  event.target.reset();
}

function handleLogin(event) {
  event.preventDefault();

  let email = document.getElementById("loginEmail").value.trim().toLowerCase();
  let pass = document.getElementById("loginPass").value;

  let data = localStorage.getItem("user_" + email);
  if (!data) {
    document.getElementById("loginMsg").innerText = "User not found. Please register first.";
    return;
  }

  let obj = JSON.parse(data);
  if (obj.pass === pass) {
    // set a simple session flag
    localStorage.setItem("bb_logged_in", email);
    document.getElementById("loginMsg").innerText = "Login successful! Redirecting...";
    setTimeout(function () {
      window.location.href = "index.html";
    }, 800);
  } else {
    document.getElementById("loginMsg").innerText = "Incorrect password.";
  }
}

/* ---------- 4) Payment page: show selected book and handle form ---------- */
function showOrderOnPaymentPage() {
  // Read book id from query string (?id=2)
  let params = new URLSearchParams(window.location.search);
  let id = params.get("id");
  if (!id) return;

  // find book by id
  let book = books.find(function (b) { return b.id == id; });
  if (!book) return;

  // show summary
  let summary = document.getElementById("orderSummary");
  if (summary) {
    summary.innerHTML = "<strong>Book:</strong> " + book.title + "<br><strong>Price:</strong> ₹" + book.price;
    // save current order in localStorage (simple)
    localStorage.setItem("bb_current_order", JSON.stringify(book));
  }
}

function handlePayment(event) {
  event.preventDefault();

  let bookStr = localStorage.getItem("bb_current_order");
  if (!bookStr) {
    document.getElementById("payMsg").innerText = "No book selected.";
    return;
  }
  let book = JSON.parse(bookStr);

  // Very simple validation
  let name = document.getElementById("cardName").value.trim();
  let number = document.getElementById("cardNumber").value.trim();
  if (!name || number.length < 12) {
    document.getElementById("payMsg").innerText = "Enter valid payment details (demo).";
    return;
  }

  // show success message
  document.getElementById("payMsg").innerHTML = "<span style='color: lightgreen;'>Payment successful for " + book.title + " (₹" + book.price + ") — Demo only.</span>";

  // clear saved order
  localStorage.removeItem("bb_current_order");
  event.target.reset();
}

/* ---------- 5) On page load: connect forms and run appropriate functions ---------- */
document.addEventListener("DOMContentLoaded", function () {
  // run showBooks (if on home page)
  showBooks();

  // connect register form if it exists
  let reg = document.getElementById("registerForm");
  if (reg) reg.addEventListener("submit", handleRegister);

  // connect login form if it exists
  let login = document.getElementById("loginForm");
  if (login) login.addEventListener("submit", handleLogin);

  // if on payment page, show order and connect payment form
  showOrderOnPaymentPage();
  let pay = document.getElementById("paymentForm");
  if (pay) pay.addEventListener("submit", handlePayment);
});
