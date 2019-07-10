const createBtn = document.getElementById("create");
const form = document.getElementById("form");
const cancelBtn = document.getElementById("cancel");
const submitBtn = document.getElementById("submit");
const background = document.getElementById("bg-div");
const dashboard = document.getElementsByClassName("topnav")[0];
const projectDropDown1 = document.getElementById("projectsnb");
const projectDropDown2 = document.getElementById("selection0");
const issuesDropDown = document.getElementById("issuesnb");
const issuesDropDown2 = document.getElementById("issuesnb2");
const assigneeDropDown = document.getElementById("selection4");
const homeBtn = document.getElementById("home");
const searchField = document.getElementById("searchField");
const searchBtn = document.getElementById("search");
const searchResults = document.getElementById("searchResults");
const resultsProjects = document.getElementById("resultsProjects");
const resultsIssues = document.getElementById("resultsIssues");
const closeSearch = document.getElementById("closeSearch");
const closeProject = document.getElementById("closeProject");
const profilePage = document.getElementById("profilePage");
const adminPageBtn = document.getElementById("adminPage");
const logoutBtn = document.getElementById("logout");
const date = document.getElementById("date");
const userDropDownMenu = document.getElementById("userDropDown");
let loggedUsersId;
let usersMenuLoaded = false;
//NEW CODE 02.07.2019

let displayedProject;
let issuesOfTheProject = [];
let reportersOfTheIssues;

//END CODE 02.07.2019

let usersData;
let projectsData;
let issuesData;

let usersAssignedIssues;
let usersWatchedIssues;

let issuesLength;
let minDate;
let todaysDate = new Date();

isItAdmin()

async function isItAdmin(){
    let check = await localStorage.getItem("adminLogged");
    let isItAdmin = await JSON.parse(check);
    showAdminPage(isItAdmin);
}

function showAdminPage(adminLogged){
    if (adminLogged === true) {
        document.getElementById("adminPage").style.display = "block";
    }
}

getId();

async function getId() {
    let userid = await localStorage.getItem("loggedUser");
    loggedUsersId = await JSON.parse(userid);
    displayPicture(loggedUsersId);
}

loadingMenus();

//Loading menus in the navigation bar
async function loadingMenus() {
    usersData = await JSON.parse(localStorage.getItem("users"));
    projectsData = await JSON.parse(localStorage.getItem("projects"))
    issuesData = await JSON.parse(localStorage.getItem("issues"));

    usersIssues(usersData);
    displayUsers(usersData);
    fillUsersMenu(usersData);
    displayProjects(projectsData);
    displayIssues(issuesData, usersAssignedIssues);
    displayIssues(issuesData, usersWatchedIssues);
}

function displayPicture(id){
    document.getElementById("navImg").setAttribute("src", `pictures/${id}.jpg`);
}

//Setting min attribute for the "Due date" in the form
date.setAttribute("min", setMinDate());

//Setting month format for the "Due date" in the form
function setMinDate() {
    if (todaysDate.getMonth().toString().length < 2 && todaysDate.getMonth() !== 9) {
        minDate = todaysDate.getFullYear() + "-0" + (todaysDate.getMonth() + 1);
        return setMinDay(minDate);
    } else {
        minDate = todaysDate.getFullYear() + "-" + (todaysDate.getMonth() + 1);
        return setMinDay(minDate);
    }
}

//Setting day format for the "Due date" in the form
function setMinDay(minDate) {
    if (todaysDate.getDate() < 10) {
        return minDate += "-0" + todaysDate.getDate()
    } else {
        return minDate += "-" + todaysDate.getDate().toString();
    }
}

//Setting month format for the issue
function formatDate(date, split){
    debugger
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if(month < 9) {
        month = "0" + month;
    }

    if (day < 10) {
        day = "0" + day;
    }
    
    return day + split + month + split + year;
}

//Setting day format for the issue
// function setDateFormatDay(data, split){
//     debugger
//     let dateFormat;
//     if (data.getDate() < 10) {
//         return dateFormat += split + "0" + data.getDate()
//     } else {
//         return dateFormat += split + "" + data.getDate().toString();
//     }
// }

//Filling the dropdown menus from the navigation bar and the form
function displayProjects(data) {
    let temp1 = "";
    let temp2 = `<option value="Empty">Select project</option>`;
    for (const project of data) {
        temp1 += `<a href="#" projetsId=${project.id}>${project.projectName}</a>`
        temp2 += `<option value=${project.id}>${project.projectName}</option>`
    }

    projectDropDown1.innerHTML = temp1;
    projectDropDown2.innerHTML = temp2;
}

//Finding issues related to the logged user
function usersIssues(data) {
    for (const user of data) {
        if (user.id === loggedUsersId) {
            usersAssignedIssues = user.assigned_issues;
            usersWatchedIssues = user.watched_issues;
        }
    }
}

//Loading assignee dropdown menu with users names
function displayUsers(data) {
    let temp = `<option value="Empty">Select user</option>`;
    for (const user of data) {
        temp += `<option value=${user.id}>${user.firstName} ${user.lastName}</option>`;
    }


    assigneeDropDown.innerHTML = temp;
}

//Loading user's dropdown menu from the navigation bar
function fillUsersMenu(data) {
    if(usersMenuLoaded === false) {
        let temp = "";
        let newListItem = document.createElement("A");
        for (const user of data) {
            if (user.id === loggedUsersId) {
                temp = `${user.firstName} ${user.lastName}`;
            }
        }

        let text = document.createTextNode(temp);
        newListItem.appendChild(text);
        userDropDownMenu.insertBefore(newListItem, userDropDownMenu.childNodes[0]);

        usersMenuLoaded = true;
    }
}

function displayIssues(data, arr) {
    issuesLength = data.length;
    let temp = "";
    for (let index = 0; index < arr.length; index++) {
        for (const issue of data) {
            if (issue.id === arr[index]) {
                // temp += `<a href="#">${issue.summary}</a>`
                temp += `<a href="#" issueId = ${issue.id} projectId = ${issue.project}>${issue.summary}</a>`
            }
        }

    }

    // if (temp === "") {
    //     temp = ``
    //     // temp = `<a href="#" style="pointer-events: none;">No issues</a>`
    // }

    whichDropDownIssuesMenu(arr, temp);
}

function whichDropDownIssuesMenu(arr, temp) {
    if (arr === usersAssignedIssues) {
        return issuesDropDown.innerHTML = temp;
    } else {
        return issuesDropDown2.innerHTML = temp;
    }
}

//NEW CODE 02.07.2019 ########################################################################################################################################
//Finding the selected project from the dropdown menu
function findTheProject(data, id){
    const project = data.find(x => x.id === id);
    projetsBasicInfo(project);
    findProjectsIssues(project);
}

//Displaying project's basic info
function projetsBasicInfo(project) {
    let projectInfo = document.getElementById("projectInfo");
    projectInfo.innerHTML = ``;
    // projectInfo.innerHTML = `<h1>${project.projectName}</h1>
    //                          <h6>Organization : <b>${project.organization}</b></h6>
    //                          <h6>Status: <b>${project.status}</b></h6>
    //                          <h6>Due date: <b>${project.dueDate}</b></h6>
    //                          <h6>Issues: <b>${project.issues.length}</b></h6>`
    projectInfo.innerHTML = `<h1>${project.projectName}</h1>
                             <table>
                                 <tbody>
                                     <tr>
                                         <td>Organization:</td>
                                         <td><b>&nbsp;&nbsp;&nbsp;${project.organization}</b></td>
                                     </tr>
                                     <tr>
                                         <td>Status:</td>
                                         <td><b>&nbsp;&nbsp;&nbsp;${project.status}</b></td>
                                     </tr>
                                     <tr>
                                         <td>Due date:</td>
                                         <td><b>&nbsp;&nbsp;&nbsp;${project.dueDate}</b></td>
                                     </tr>
                                     <tr>
                                         <td>Issues:</td>
                                         <td><b>&nbsp;&nbsp;&nbsp;${project.issues.length}</b></td>
                                     </tr>
                                 </tbody>
                             </table>`
}

//Finding issues related to the project
function findProjectsIssues(data){
    issuesOfTheProject = [];
    const issues = data.issues;
    for (const issue of issues) {
        const match = issuesData.find(x => x.id === issue)
        issuesOfTheProject.push(match);
    }
    projectsIssues(issuesOfTheProject, "all");
    projectsIssues(issuesOfTheProject, "open");
    projectsIssues(issuesOfTheProject, "resolved");
}

//Creating tables with issues for the selected project
function createTable(div, text) {
    const table = document.createElement("table");
    table.setAttribute("class", "table table-striped");
    const thead = document.createElement("thead");
    thead.innerHTML = `<tr>
                            <th scope="col">Title</th>
                            <th scope="col">Reporter</th>
                            <th scope="col">Status</th>
                       </tr>`;
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    tbody.innerHTML = text;
    table.appendChild(tbody);
    div.appendChild(table);
}

//Creating tables with issues for the selected project depending on their status
function projectsIssues(issues, status) {

    let text = ``;
    const div = document.getElementById(status);
    div.innerHTML = "";

    if (status === "all") {
        for (const issue of issues) {
            text += `<tr>
                        <td class="projectIssue" idIssue=${issue.id} idProject=${issue.project}>${issue.summary}</td>
                        <td>${usersData[issue.reporter - 1].firstName} ${usersData[issue.reporter - 1].lastName}</td>
                        <td>${issue.status}</td>
                    </tr>`
        }
    } else {
        for (const issue of issues) {
            if (issue.status === status) {
                text += `<tr>
                            <td class="projectIssue" idIssue=${issue.id} idProject=${issue.project}>${issue.summary}</td>
                            <td>${usersData[issue.reporter - 1].firstName} ${usersData[issue.reporter - 1].lastName}</td>
                            <td>${issue.status}</td>
                        </tr>`
            }
        }
    }

    if (text !== ``) {
        createTable(div, text);
    } else if (status !== "all") {
        div.innerHTML = `<p style="margin-top: 30px;">This project doesn't have ${status} issues.</p>`
    } else {
        div.innerHTML = `<p style="margin-top: 30px;">This project doesn't have issues.</p>`
    }

}

//END CODE 02.07.2019 ########################################################################################################################################

//Home button
homeBtn.addEventListener("click", () => {
    window.location.href = "main.html";
})

//"Create issue" button
createBtn.addEventListener("click", () => {
    form.style.display = "block";
    background.style.filter = "blur(7px)";
    dashboard.style.filter = "blur(7px)";

    //new code
    document.getElementById("projectsPage").classList.add("d-none");
    document.getElementById("g-container1").classList.add("d-none");
    document.getElementsByClassName("g-container2")[0].classList.add("d-none");
    searchResults.classList.add("d-none");

});

//Issue form "Cancel" button
cancelBtn.addEventListener("click", () => {
    form.style.display = "none";
    background.style.filter = "";
    dashboard.style.filter = "";

    //new code
    document.getElementById("g-container1").classList.remove("d-none");
    document.getElementsByClassName("g-container2")[0].classList.remove("d-none");
    searchResults.classList.add("d-none");
    // searchResults.classList.remove("d-none");
});

//Submit button for the "Create issue" form
submitBtn.addEventListener("click", (e) => {
    debugger
    e.preventDefault();

    const projects = document.getElementById("selection0").value;
    const issueType = document.getElementById("selection1").value;
    const organization = document.getElementById("selection2").value;
    const summary = document.getElementById("summary").value;
    const priority = document.getElementById("selection3").value;
    const components = document.getElementById("components").value;
    const affectsVersion = document.getElementById("affects_version").value;
    const fixVersion = document.getElementById("fix_version").value;
    const assignee = document.getElementById("selection4").value;
    const description = document.getElementById("description").value;
    console.log(assignee);

    if (summary === "" || description === "" || components === "" || affectsVersion === "" || fixVersion === "") {
        alert("Don't leave empty fields.");
        return;
    } else {

        let dueDate = new Date(date.value);
        let date1 = formatDate(dueDate, ".");
        console.log(date1);
        let createDate = new Date();
        let date2 = formatDate(createDate, "/");
        let id = issuesLength + 1

        issuesData.push({
            id: id.toString(),
            project: projects,
            issue_type: issueType,
            reporter: loggedUserId,
            organization: organization,
            summary: summary,
            priority: priority,
            dueDate: date1,
            component: components,
            affectedVersion: affectsVersion,
            fixVersion: fixVersion,
            assignee: Number(assignee),
            description: description,
            createDate: date2,
            comments: [],
            status: "open",
            watchers: [loggedUserId],
        });


        projectsData[projects - 1].issues.push(id.toString());
        document.getElementById("reset").click();
        localStorage.setItem("projects", JSON.stringify(projectsData));
        localStorage.setItem("issues", JSON.stringify(issuesData));
        // console.log(issuesData);

        // console.log(JSON.parse(localStorage.getItem("projects")));
        console.log(JSON.parse(localStorage.getItem("issues")));
        document.getElementById("projects").innerHTML = "";
        document.getElementsByClassName("g-second")[0].innerHTML = "";
        document.getElementsByClassName("g-third")[0].innerHTML = "";
        loadingMenus();
        gGetData();
    }

});

//Admin page button from user's dropdown menu
adminPageBtn.addEventListener("click", () => {
    window.location.href = "admin.html";
})

//User's profile page from dropdown menu
profilePage.addEventListener("click", () => {
    window.location.href = "profile.html";
})

//Log out button from user's dropdown menu
logoutBtn.addEventListener("click", () => {
    document.getElementById("adminPage").style.display = "none";
    adminLogged = false;
    localStorage.setItem("adminLogged", adminLogged);
    window.location.href = "login.html";
})

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();

    //new code
    background.style.filter = "blur(7px)";
    //end of the new code
    document.getElementById("projectsPage").classList.add("d-none");
    document.getElementById("g-container1").classList.add("d-none");
    document.getElementsByClassName("g-container2")[0].classList.add("d-none");
    searchResults.classList.remove("d-none");

    let term = searchField.value.toLowerCase();

    if (term === ``) {
        return;
    }

    let temp1 = ``;
    let temp2 = ``;
    console.log(term);

    let match1 = projectsData.filter(issue => issue.projectName.toLowerCase().includes(term));
    for (const project of match1) {
        temp1 += `<a href="#"  class="searchResult" projectsId=${project.id}>${project.projectName}</a><br><br>`
        // temp += `<option value=${issue.id}>${issue.summary}</option>`
    }

    let match2 = issuesData.filter(issue => issue.summary.toLowerCase().includes(term));
    for (const issue of match2) {
        temp2 += `<a href="#" class="searchResult" idOfIssue=${issue.id} idOfProject=${issue.project}>${issue.summary}</a><br><br>`
        // temp += `<option value=${issue.id}>${issue.summary}</option>`
    }

    if (temp1 === ``) {
        temp1 = `<p>No results.</p>`
    }

    if (temp2 === ``) {
        temp2 = `<p>No results.</p>`
    }

    resultsProjects.innerHTML = temp1;
    resultsIssues.innerHTML = temp2;
    searchField.value = ``;
    
})

closeSearch.addEventListener("click", () => {
    document.getElementById("g-container1").classList.remove("d-none");
    document.getElementsByClassName("g-container2")[0].classList.add("d-none");
    searchResults.classList.add("d-none");

    //new code
    background.style.filter = "";
    //end of the new code
})


//TEST 
//Opens selected project from the dropdown menu
projectDropDown1.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(e.target);

    //NEW CODE 02.07.2019 #################################################################################
    document.getElementById("projectsPage").classList.remove("d-none");
    document.getElementById("searchResults").classList.add("d-none");
    document.getElementById("projectsPage").classList.remove("d-none");
    document.getElementById("g-container1").classList.add("d-none");
    document.getElementsByClassName("g-container2")[0].classList.add("d-none");
    background.style.filter = "blur(7px)";
    let id = e.srcElement.getAttribute("projetsId")
    // let projectsName = e.target.innerText
    // document.getElementById("projectsName").innerText = projectsName;
    // console.log(projectsName)
    // console.log(id);
    findTheProject(projectsData, id);

    //END CODE 02.07.2019 #################################################################################
    
})

//Closes displayed results about selected project
closeProject.addEventListener("click", () => {
    document.getElementById("projectsPage").classList.add("d-none");
    document.getElementById("g-container1").classList.remove("d-none");
    document.getElementsByClassName("g-container2")[0].classList.add("d-none");

    document.getElementById("g-container1").style.display = "";
    background.style.filter = "";
    // document.getElementById("g-container1").style.display = "";
})

issuesDropDown.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("projectsPage").classList.add("d-none");
    document.getElementById("searchResults").classList.add("d-none");
    document.getElementsByClassName("g-container2")[0].innerHTML = "";
    document.getElementById("g-container1").classList.add("d-none");
    document.getElementsByClassName("g-container2")[0].classList.remove("d-none");
    populateIssuePage2(e.srcElement.getAttribute("projectId"), e.srcElement.getAttribute("issueId"));
})

issuesDropDown2.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("projectsPage").classList.add("d-none");
    document.getElementById("searchResults").classList.add("d-none");
    document.getElementsByClassName("g-container2")[0].innerHTML = "";
    document.getElementById("g-container1").classList.add("d-none");
    document.getElementsByClassName("g-container2")[0].classList.remove("d-none");
    populateIssuePage2(e.srcElement.getAttribute("projectId"), e.srcElement.getAttribute("issueId"));

})

async function populateIssuePage2(projectId, issueId) {
    let findIssue = await gDataIssues.filter(issue => issue.project === projectId)
        .find(issue => issue.id === issueId);
    let findProject = await gDataProjects.find(project => project.id === projectId);
    let findUser = await gDataUsers.find(user => user.id === findIssue.assignee);
    let findReporter = await gDataUsers.find(project => project.id === findIssue.reporter)
    gPopulateHeaderSection(findIssue, findProject);
    gPopulateDescriptionSection(findIssue);
    gPopulatePeopleSection(findReporter, findUser, findIssue, gDataUsers, gDataIssues);
    gPopulateDescription(findIssue);
    gPopulateDates(findIssue, findProject);
    gPopulateCommentArea(findIssue, gDataUsers, gDataIssues);
}

//TEST
//Linking the search results for issue with the info of the subject 
document.getElementById("resultsIssues").addEventListener("click", (e) => {
    if (e.target.classList.contains("searchResult")) {
        document.getElementsByClassName("g-container2")[0].innerHTML = ``;
        console.log(e.srcElement.getAttribute("idProject"));
        console.log(e.srcElement.getAttribute("idIssue"));
        document.getElementById("searchResults").classList.add("d-none");
        document.getElementsByClassName("g-container2")[0].classList.remove("d-none");
        populateIssuePage2(e.srcElement.getAttribute("idOfProject"), e.srcElement.getAttribute("idOfIssue"));
    }
});

//Linking the search results for projects with the info of the subject 
document.getElementById("resultsProjects").addEventListener("click", (e) => {
    if (e.target.classList.contains("searchResult")) {
        let projectId = e.srcElement.getAttribute("projectsId");
        document.getElementById("searchResults").classList.add("d-none");
        document.getElementById("projectsPage").classList.remove("d-none");
        findTheProject(projectsData, projectId);;
    }
});

document.getElementById("projectsPage").addEventListener("click", (e) => {
    if (e.target.classList.contains("projectIssue")) {
        document.getElementsByClassName("g-container2")[0].innerHTML = ``;
        let projectId = e.srcElement.getAttribute("idProject");
        let issueId = e.srcElement.getAttribute("idIssue");
        document.getElementById("projectsPage").classList.add("d-none");
        document.getElementsByClassName("g-container2")[0].classList.remove("d-none");
        populateIssuePage2(projectId, issueId);
    }
});