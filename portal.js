// ======================================================
// VICTOR SCHOOL - STUDENT PORTAL
// ======================================================

import {
    auth,
    db
} from "./firebase.js";

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

const loadingScreen =
    document.getElementById("loadingScreen");

const topStudentName =
    document.getElementById("topStudentName");

const topStudentClass =
    document.getElementById("topStudentClass");

const studentAvatar =
    document.getElementById("studentAvatar");

const logoutBtn =
    document.getElementById("logoutBtn");

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");


// ======================================================
// CHECK LOGIN
// ======================================================

onAuthStateChanged(auth, async (user) => {

    console.log("Firebase auth state:", user);

    // --------------------------------------------------
    // No logged-in student
    // --------------------------------------------------

    if (!user) {

        console.log("No logged-in student.");

        window.location.href = "./index.html";

        return;
    }


    console.log("Student logged in:", user.uid);


    try {

        // --------------------------------------------------
        // Get student document
        // --------------------------------------------------

        const studentRef =
            doc(db, "students", user.uid);

        const studentSnap =
            await getDoc(studentRef);


        console.log(
            "Student document exists:",
            studentSnap.exists()
        );


        // --------------------------------------------------
        // Student document does not exist
        // --------------------------------------------------

        if (!studentSnap.exists()) {

            console.error(
                "Student document was not found:",
                user.uid
            );

            alert(
                "Your student account was found, but your student information could not be found."
            );

            await signOut(auth);

            window.location.href = "./index.html";

            return;
        }


        // --------------------------------------------------
        // Student data
        // --------------------------------------------------

        const student =
            studentSnap.data();


        console.log("Student data:", student);


        const fullname =
            student.fullname || "Student";

        const studentClass =
            student.studentClass || "Not assigned";


        // --------------------------------------------------
        // TOP BAR
        // --------------------------------------------------

        if (topStudentName) {

            topStudentName.textContent =
                fullname;

        }


        if (topStudentClass) {

            topStudentClass.textContent =
                studentClass;

        }


        if (studentAvatar) {

            studentAvatar.textContent =
                fullname
                    .trim()
                    .charAt(0)
                    .toUpperCase();

        }


        // --------------------------------------------------
        // POPULATE PAGE
        // --------------------------------------------------

        populateStudentInfo(student);


        // --------------------------------------------------
        // HIDE LOADING SCREEN
        // --------------------------------------------------

        hideLoading();


        console.log(
            "Student portal loaded successfully."
        );

    }

    catch (error) {

        console.error(
            "Portal loading error:",
            error
        );


        if (loadingScreen) {

            loadingScreen.innerHTML = `

                <div
                    style="
                        text-align:center;
                        padding:30px;
                        max-width:500px;
                        margin:auto;
                    "
                >

                    <h2>
                        Unable to load student portal
                    </h2>

                    <p
                        style="
                            margin-top:12px;
                            color:#666;
                            line-height:1.6;
                        "
                    >
                        There was a problem loading your
                        student information.
                    </p>

                    <p
                        style="
                            margin-top:10px;
                            color:#999;
                            font-size:13px;
                        "
                    >
                        Error:
                        ${error.message || "Unknown error"}
                    </p>

                    <button
                        onclick="location.reload()"
                        style="
                            margin-top:20px;
                            padding:12px 24px;
                            border:0;
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

});


// ======================================================
// POPULATE STUDENT INFORMATION
// ======================================================

function populateStudentInfo(student) {

    const fullname =
        student.fullname || "Student";

    const admission =
        student.admissionNumber || "Not available";

    const studentClass =
        student.studentClass || "Not assigned";


    const firstLetter =
        fullname
            .trim()
            .charAt(0)
            .toUpperCase();


    // --------------------------------------------------
    // DASHBOARD
    // --------------------------------------------------

    const welcomeName =
        document.getElementById("welcomeName");

    const classCard =
        document.getElementById("classCard");


    if (welcomeName) {

        welcomeName.textContent =
            fullname
                .trim()
                .split(/\s+/)[0];

    }


    if (classCard) {

        classCard.textContent =
            studentClass;

    }


    // --------------------------------------------------
    // PROFILE
    // --------------------------------------------------

    const profileAvatar =
        document.getElementById("profileAvatar");

    const profileName =
        document.getElementById("profileName");

    const profileAdmission =
        document.getElementById("profileAdmission");

    const profileFullname =
        document.getElementById("profileFullname");

    const profileAdmissionNumber =
        document.getElementById(
            "profileAdmissionNumber"
        );

    const profileClass =
        document.getElementById("profileClass");


    if (profileAvatar) {

        profileAvatar.textContent =
            firstLetter;

    }


    if (profileName) {

        profileName.textContent =
            fullname;

    }


    if (profileAdmission) {

        profileAdmission.textContent =
            admission;

    }


    if (profileFullname) {

        profileFullname.textContent =
            fullname;

    }


    if (profileAdmissionNumber) {

        profileAdmissionNumber.textContent =
            admission;

    }


    if (profileClass) {

        profileClass.textContent =
            studentClass;

    }

}


// ======================================================
// LOGOUT
// ======================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {

                return;

            }


            try {

                await signOut(auth);

                window.location.href =
                    "./index.html";

            }

            catch (error) {

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
// SIDEBAR NAVIGATION
// ======================================================

const navLinks =
    document.querySelectorAll(".nav-link");


navLinks.forEach((link) => {

    link.addEventListener(
        "click",
        () => {

            closeSidebar();

        }
    );

});


// ======================================================
// MOBILE MENU
// ======================================================

if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        () => {

            if (sidebar) {

                sidebar.classList.add("open");

            }


            if (sidebarOverlay) {

                sidebarOverlay.classList.add("show");

            }

        }
    );

}


// ======================================================
// CLOSE SIDEBAR
// ======================================================

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
// HIDE LOADING
// ======================================================

function hideLoading() {

    if (loadingScreen) {

        loadingScreen.classList.add("hidden");

    }

}