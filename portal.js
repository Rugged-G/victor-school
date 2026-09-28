import {
    auth,
    db
} from "../firebase.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* ==============================
   ELEMENTS
================================= */

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


let currentStudent = null;


/* ==============================
   CHECK LOGIN
================================= */

onAuthStateChanged(
    auth,
    async (user) => {


        /*
         * If there is no logged-in student,
         * send them back to the public website.
         */

        if (!user) {

            window.location.href =
                "./index.html";

            return;

        }


        try {


            /*
             * Get the student's Firestore document.
             *
             * students/{Firebase UID}
             */

            const studentRef =
                doc(
                    db,
                    "students",
                    user.uid
                );


            const studentSnap =
                await getDoc(studentRef);


            /*
             * If the student's Firestore
             * document doesn't exist,
             * don't allow access to the portal.
             */

            if (!studentSnap.exists()) {


                await signOut(auth);


                window.location.href =
                    "./index.html";


                return;

            }


            currentStudent =
                studentSnap.data();


            const fullname =
                currentStudent.fullname ||
                "Student";


            const studentClass =
                currentStudent.studentClass ||
                "Not assigned";


            /*
             * TOP BAR
             */

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


            /*
             * Fill information
             * on the current page.
             */

            populateStudentInfo(
                currentStudent
            );


            /*
             * Remove loading screen.
             */

            hideLoading();


        } catch (error) {


            console.error(
                "Portal loading error:",
                error
            );


            /*
             * Show an error instead
             * of leaving the student
             * stuck on loading forever.
             */

            if (loadingScreen) {


                loadingScreen.innerHTML = `

                    <div
                        style="
                            text-align:center;
                            padding:30px;
                            max-width:450px;
                        "
                    >

                        <h2>
                            Unable to load student portal
                        </h2>

                        <p
                            style="
                                margin-top:10px;
                                color:#666;
                                line-height:1.6;
                            "
                        >
                            Please check your internet
                            connection and try again.
                        </p>

                        <button
                            onclick="location.reload()"
                            style="
                                margin-top:20px;
                                padding:12px 24px;
                                border:0;
                                border-radius:8px;
                                background:#2563eb;
                                color:#fff;
                                cursor:pointer;
                            "
                        >
                            Try Again
                        </button>

                    </div>

                `;

            }

        }

    }
);


/* ==============================
   POPULATE STUDENT INFORMATION
================================= */

function populateStudentInfo(student) {


    const fullname =
        student.fullname ||
        "Student";


    const admission =
        student.admissionNumber ||
        "Not available";


    const studentClass =
        student.studentClass ||
        "Not assigned";


    const firstLetter =
        fullname
            .trim()
            .charAt(0)
            .toUpperCase();


    /*
     * Dashboard
     */

    const welcomeName =
        document.getElementById(
            "welcomeName"
        );


    const classCard =
        document.getElementById(
            "classCard"
        );


    /*
     * Profile
     */

    const profileAvatar =
        document.getElementById(
            "profileAvatar"
        );


    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileAdmission =
        document.getElementById(
            "profileAdmission"
        );


    const profileFullname =
        document.getElementById(
            "profileFullname"
        );


    const profileAdmissionNumber =
        document.getElementById(
            "profileAdmissionNumber"
        );


    const profileClass =
        document.getElementById(
            "profileClass"
        );


    /*
     * Dashboard welcome name
     */

    if (welcomeName) {

        welcomeName.textContent =
            fullname
                .trim()
                .split(/\s+/)[0];

    }


    /*
     * Dashboard class
     */

    if (classCard) {

        classCard.textContent =
            studentClass;

    }


    /*
     * Profile avatar
     */

    if (profileAvatar) {

        profileAvatar.textContent =
            firstLetter;

    }


    /*
     * Profile name
     */

    if (profileName) {

        profileName.textContent =
            fullname;

    }


    /*
     * Profile admission number
     */

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


/* ==============================
   LOGOUT
================================= */

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


/* ==============================
   SIDEBAR NAVIGATION
================================= */

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


navLinks.forEach(
    (link) => {


        link.addEventListener(
            "click",
            () => {

                closeSidebar();

            }
        );

    }
);


/* ==============================
   MOBILE MENU
================================= */

if (menuBtn) {


    menuBtn.addEventListener(
        "click",
        () => {


            if (sidebar) {

                sidebar.classList.add(
                    "open"
                );

            }


            if (sidebarOverlay) {

                sidebarOverlay.classList.add(
                    "show"
                );

            }

        }
    );

}


/* ==============================
   CLOSE SIDEBAR
================================= */

if (sidebarOverlay) {


    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );

}


function closeSidebar() {


    if (sidebar) {

        sidebar.classList.remove(
            "open"
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "show"
        );

    }

}


/* ==============================
   HIDE LOADING
================================= */

function hideLoading() {


    if (loadingScreen) {

        loadingScreen.classList.add(
            "hidden"
        );

    }

}