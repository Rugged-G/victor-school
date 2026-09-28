// ======================================================
// VICTOR SCHOOL - STUDENT DASHBOARD
// ======================================================

import { auth, db } from "../firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// ======================================================
// ELEMENTS
// ======================================================

const loadingScreen = document.getElementById("loadingScreen");

const welcomeName = document.getElementById("welcomeName");
const topStudentName = document.getElementById("topStudentName");
const topStudentClass = document.getElementById("topStudentClass");

const studentAvatar = document.getElementById("studentAvatar");
const classCard = document.getElementById("classCard");

const profileAvatar = document.getElementById("profileAvatar");
const profileName = document.getElementById("profileName");
const profileAdmission = document.getElementById("profileAdmission");
const profileFullname = document.getElementById("profileFullname");
const profileAdmissionNumber =
    document.getElementById("profileAdmissionNumber");
const profileClass = document.getElementById("profileClass");

const logoutBtn = document.getElementById("logoutBtn");


// ======================================================
// START DASHBOARD
// ======================================================

console.log("Victor School Dashboard JS loaded.");
console.log("Waiting for Firebase authentication...");


// ======================================================
// CHECK LOGIN STATUS
// ======================================================

onAuthStateChanged(auth, async (user) => {

    console.log("Dashboard auth state:", user);

    // --------------------------------------------------
    // USER IS NOT LOGGED IN
    // --------------------------------------------------

    if (!user) {

        console.log("No logged-in student.");

        window.location.href = "./index.html";

        return;
    }


    // --------------------------------------------------
    // USER IS LOGGED IN
    // --------------------------------------------------

    console.log("Logged-in student UID:", user.uid);


    try {

        await loadStudentData(user);

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        showDashboardError(error);

    }

});


// ======================================================
// LOAD STUDENT DATA
// ======================================================

async function loadStudentData(user) {

    console.log("Getting student document...");


    const studentRef = doc(
        db,
        "students",
        user.uid
    );


    // --------------------------------------------------
    // FIRESTORE TIMEOUT
    // --------------------------------------------------

    const firestoreRequest = getDoc(studentRef);

    const timeout = new Promise((_, reject) => {

        setTimeout(() => {

            reject(
                new Error(
                    "Firestore request took too long."
                )
            );

        }, 10000);

    });


    const studentSnap = await Promise.race([
        firestoreRequest,
        timeout
    ]);


    console.log(
        "Student document exists:",
        studentSnap.exists()
    );


    // --------------------------------------------------
    // STUDENT DOCUMENT NOT FOUND
    // --------------------------------------------------

    if (!studentSnap.exists()) {

        console.error(
            "Student document does not exist."
        );

        alert(
            "Your account is logged in, but your student information could not be found."
        );

        await signOut(auth);

        window.location.href = "./index.html";

        return;
    }


    // --------------------------------------------------
    // GET DATA
    // --------------------------------------------------

    const student = studentSnap.data();

    console.log(
        "Student information loaded:",
        student
    );


    const fullname =
        student.fullname || "Student";

    const admissionNumber =
        student.admissionNumber || "Not available";

    const studentClass =
        student.studentClass || "Not assigned";


    const firstLetter =
        fullname.trim().charAt(0).toUpperCase();


    // ==================================================
    // UPDATE DASHBOARD
    // ==================================================

    welcomeName.textContent =
        getFirstName(fullname);

    topStudentName.textContent =
        fullname;

    topStudentClass.textContent =
        studentClass;

    studentAvatar.textContent =
        firstLetter;

    classCard.textContent =
        studentClass;


    // ==================================================
    // UPDATE PROFILE
    // ==================================================

    profileAvatar.textContent =
        firstLetter;

    profileName.textContent =
        fullname;

    profileAdmission.textContent =
        admissionNumber;

    profileFullname.textContent =
        fullname;

    profileAdmissionNumber.textContent =
        admissionNumber;

    profileClass.textContent =
        studentClass;


    // ==================================================
    // EVERYTHING LOADED
    // ==================================================

    hideLoading();

    console.log(
        "Student dashboard loaded successfully."
    );
}


// ======================================================
// GET FIRST NAME
// ======================================================

function getFirstName(fullname) {

    return fullname
        .trim()
        .split(/\s+/)[0];

}


// ======================================================
// SHOW ERROR
// ======================================================

function showDashboardError(error) {

    console.error(error);


    if (loadingScreen) {

        loadingScreen.innerHTML = `
            <div style="
                text-align:center;
                padding:30px;
                max-width:450px;
            ">
                <h2>Unable to load dashboard</h2>

                <p style="
                    margin-top:10px;
                    color:#666;
                ">
                    We could not load your student information.
                    Please check your internet connection and try again.
                </p>

                <button
                    onclick="location.reload()"
                    style="
                        margin-top:20px;
                        padding:12px 22px;
                        border:none;
                        border-radius:8px;
                        background:#2563eb;
                        color:white;
                        cursor:pointer;
                    "
                >
                    Try Again
                </button>
            </div>
        `;

    }

}


// ======================================================
// LOGOUT
// ======================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {
                return;
            }


            try {

                await signOut(auth);

                window.location.href =
                    "./index.html";

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

                alert(
                    "Unable to logout. Please try again."
                );

            }

        }
    );

}


// ======================================================
// PAGE NAVIGATION
// ======================================================

const navLinks =
    document.querySelectorAll(".nav-link");

const pageSections =
    document.querySelectorAll(".page-section");


function showSection(sectionId) {

    pageSections.forEach(section => {

        section.classList.remove(
            "active-section"
        );

    });


    const targetSection =
        document.getElementById(sectionId);


    if (targetSection) {

        targetSection.classList.add(
            "active-section"
        );

    }


    navLinks.forEach(link => {

        link.classList.remove("active");


        if (
            link.dataset.section ===
            sectionId
        ) {

            link.classList.add("active");

        }

    });


    history.replaceState(
        null,
        "",
        "#" + sectionId
    );


    closeSidebar();

}


// ======================================================
// SIDEBAR LINKS
// ======================================================

navLinks.forEach(link => {

    link.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            showSection(
                this.dataset.section
            );

        }
    );

});


// ======================================================
// QUICK ACCESS BUTTONS
// ======================================================

const sectionButtons =
    document.querySelectorAll(
        "[data-section-target]"
    );


sectionButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            showSection(
                this.dataset.sectionTarget
            );

        }
    );

});


// ======================================================
// OPEN SECTION FROM URL
// ======================================================

const startingSection =
    window.location.hash.replace(
        "#",
        ""
    );


if (
    startingSection &&
    document.getElementById(startingSection)
) {

    showSection(startingSection);

} else {

    showSection("dashboard");

}


// ======================================================
// MOBILE SIDEBAR
// ======================================================

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById(
        "sidebarOverlay"
    );


if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        () => {

            sidebar.classList.add("open");

            sidebarOverlay.classList.add("show");

        }
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );

}


function closeSidebar() {

    if (sidebar) {

        sidebar.classList.remove("open");

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.remove("show");

    }

}


// ======================================================
// HIDE LOADING SCREEN
// ======================================================

function hideLoading() {

    if (!loadingScreen) {
        return;
    }


    loadingScreen.classList.add(
        "hidden"
    );

}