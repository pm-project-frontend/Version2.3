var btnLogIn = document.getElementById("btnLogIn");

// let adminLogged = false;
//Successfully logged user
let LoggedUserId;

//Local storages
let localStorageUsers;
let localStorageProjects;
let localStorageIssues;

//The user trying to login
let userAttempting;
let userAttemptingId;
let attempts = 0;

//Grabbing data from the jsons
importJsons();

async function importJsons() {
  try {
    let users = await fetch("https://raw.githubusercontent.com/pm-project-frontend/jsons/master/users.json");
    let usersData = await users.json();
    let projects = await fetch("https://raw.githubusercontent.com/pm-project-frontend/jsons/master/projects.json");
    let projectsData = await projects.json();
    let issues = await fetch("https://raw.githubusercontent.com/pm-project-frontend/jsons/master/issues.json");
    let issuesData = await issues.json();
    localStorage.setItem("users", JSON.stringify(usersData));
    localStorage.setItem("projects", JSON.stringify(projectsData));
    localStorage.setItem("issues", JSON.stringify(issuesData));
    loadLocalStorage();
  } catch (error) {
    throw new Error("Something went wrong.")
  }
}

//Loading data into local storage
function loadLocalStorage() {
  let lsUsers = localStorage.getItem("users");
  localStorageUsers = JSON.parse(lsUsers);
  let lsProjects = localStorage.getItem("projects");
  localStorageProjects = JSON.parse(lsProjects);
  let lsIssues = localStorage.getItem("issues");
  localStorageIssues = JSON.parse(lsIssues);
}

//LogIn button
btnLogIn.addEventListener("click", function (e) {
  e.preventDefault();
  var username = document.getElementById("fusername").value;
  var password = document.getElementById("fpassword").value;
  consecutiveAttempts(username);
  checkLogin(username, password);
})

//Login check for consecutive attempts
function consecutiveAttempts(username) {
  if (username !== userAttempting) {
    userAttempting = username;
    attempts = 0;
  }
}

//Logging went ok
function loginPassed(page, id) {
  attempts = 0;
  userAttempting = null;
  localStorage.setItem("loggedUser", id);
  loginIsOk = false;
  window.location.href = page;
}

//Suspension of an account
function suspendAccount(id) {
  localStorageUsers[id - 1].status = "suspended";
  localStorage.setItem("users", JSON.stringify(localStorageUsers));
  userAttemptingId = null;
  userAttempting = null;
  attempts = 0;
  alert("Three unsuccessful attempts, your account has been suspended. Contact your admin.");
}

//Main check procedure
function checkLogin(username, password) {
  debugger
  if (username === "" || password === "") {
    return alert("Don't leave empty fields.")
  }

  for (const user of localStorageUsers) {
    if (user.userName === username && user.password !== password) {
      userAttemptingId = user.id;
      if (user.status === "suspended") {
        return alert("Your account has been suspended. Contact your administrator.");
      }

      if (user.userName === userAttempting && attempts !== 2) {
        attempts++;
        return alert("Something went wrong, check your username/password.");
      }

      if (user.userName === userAttempting && attempts === 2) {
        return suspendAccount(userAttemptingId);
      }
    }

    if (user.userName === username && user.password === password) {
      let loginIsOk = true;
      userAttemptingId = user.id;
      if (user.status === "suspended") {
        return alert("Your account has been suspended. Contact your administrator.");
      }

      if (loginIsOk && user.role === "admin") {
        adminLogged = true;
        localStorage.setItem("adminLogged", adminLogged);
        return loginPassed("admin.html", userAttemptingId);
      }

      if (loginIsOk && user.role === "user") {
        return loginPassed("main.html", userAttemptingId);
      }
    }
  }

  alert("There's no such user.")
}