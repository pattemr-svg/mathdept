/*
==========================================
MDST
Math Department Service Team
Version 0.2
==========================================
*/
const API_URL = "https://script.google.com/macros/s/AKfycbxdvPcTVo1AxbKQosOza-6PmlKUYBqiUrVY-0c-HdUxziiziPHKqEU1XYp2nTd_2Xn24A/exec";
async function loadSignups() {

    try {

        const response =
            await fetch(`${API_URL}?action=signups`);

        const data =
            await response.json();

        if (!data.success) {

            console.error(
                "MDST could not load signups:",
                data.error
            );

            return [];

        }

        console.log(
            "MDST signups loaded:",
            data.signups
        );

        return data.signups;

    } catch (error) {

        console.error(
            "MDST could not connect to the signup database:",
            error
        );

        return [];

    }

}
const calendarData = {

    currentWeek: [

        {
            date: "2026-08-10",
            day: "Monday",
            teacher: "Mr. Patterson",
            capacity: 5,
            students: []
        },

        {
            date: "2026-08-11",
            day: "Tuesday",
            teacher: "Mrs. Smith",
            capacity: 5,
            students: []
        },

        {
            date: "2026-08-12",
            day: "Wednesday",
            teacher: "Mr. Johnson",
            capacity: 3,
            students: []
        },

        {
            date: "2026-08-13",
            day: "Thursday",
            teacher: "Mrs. Brown",
            capacity: 5,
            students: []
        },

        {
            date: "2026-08-14",
            day: "Friday",
            teacher: "Mr. Davis",
            capacity: 5,
            students: []
        }

    ],

    nextWeek: [

        {
            date: "2026-08-17",
            day: "Monday",
            teacher: "Mr. Patterson",
            capacity: 5,
            students: []
        },

        {
            date: "2026-08-18",
            day: "Tuesday",
            teacher: "Mrs. Smith",
            capacity: 5,
            students: []
        },

        {
            date: "2026-08-19",
            day: "Wednesday",
            teacher: "Mr. Johnson",
            capacity: 3,
            students: []
        },

        {
            date: "2026-08-20",
            day: "Thursday",
            teacher: "Mrs. Brown",
            capacity: 5,
            students: []
        },

        {
            date: "2026-08-21",
            day: "Friday",
            teacher: "Mr. Davis",
            capacity: 5,
            students: []
        }

    ]

};


function createAvatar(name){

    const parts = name.split(" ");

    const initials =
        parts[0].charAt(0) +
        parts[1].charAt(0);

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = initials;

    return avatar;

}


function createChip(name){

    const chip = document.createElement("div");
    chip.className = "student-chip";

    chip.appendChild(createAvatar(name));

    const span = document.createElement("span");
    span.textContent = name;

    chip.appendChild(span);

    return chip;

}


function buildWeek(containerId, week){

    const container =
        document.getElementById(containerId);

    container.innerHTML = "";

    week.forEach(day=>{

        const template =
            document
            .getElementById("dayCardTemplate")
            .content
            .cloneNode(true);

    template.querySelector(".day-name").textContent =
    day.day;
	
	template.querySelector(".day-date").textContent =
    new Date(day.date + "T00:00:00")
        .toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        });

template.querySelector(".teacher-name").textContent =
    day.teacher;

        const capacityBadge =
    template.querySelector(".capacity-badge");

capacityBadge.textContent =
    `${day.students.length}/${day.capacity}`;



        const percent =
            (day.students.length/day.capacity)*100;

        template.querySelector(".progress-fill")
            .style.width = percent + "%";


        if (percent < 60) {

    capacityBadge.classList.add("capacity-green");

}
else if (percent < 100) {

    capacityBadge.classList.add("capacity-yellow");

}
else {

    capacityBadge.classList.add("capacity-red");

}

        const studentList =
            template.querySelector(".student-list");

        day.students.forEach(student=>{

            studentList.appendChild(
                createChip(student)
            );

        });
const joinButton =
    template.querySelector(".join-team");

const isFull =
    day.students.length >= day.capacity;

if (isFull) {

    joinButton.textContent =
        "🔒 Team Full";

    joinButton.disabled = true;

    joinButton.classList.add("team-full");

}

joinButton.dataset.date = day.date;

joinButton.dataset.day = day.day;

joinButton.dataset.week =
    containerId === "currentWeek"
        ? "current"
        : "next";
        container.appendChild(template);

    });

}

function setRandomMascot() {

    const mascot =
        document.getElementById("mdstMascot");

    if (!mascot) {
        return;
    }

    const mascots = [

        "images/math-mascot-1.png",

        "images/math-mascot-2.png",

        "images/math-mascot-3.png"

    ];

    const randomIndex =
        Math.floor(
            Math.random() * mascots.length
        );

    mascot.src =
        mascots[randomIndex];

}
async function initialize() {

    // Clear existing student data before reloading
    [
        ...calendarData.currentWeek,
        ...calendarData.nextWeek
    ].forEach(day => {
        day.students = [];
    });

    const signups = await loadSignups();

    console.log(
        "Live signup data:",
        signups
    );

    signups.forEach(signup => {

        if (!signup.Date || !signup.Day) {
            return;
        }

        const signupDate =
            String(signup.Date).substring(0, 10);

        const allDays = [
            ...calendarData.currentWeek,
            ...calendarData.nextWeek
        ];

        const targetDay =
            allDays.find(day =>
                day.date === signupDate &&
                day.day === signup.Day
            );

        if (targetDay) {

            const fullName =
    signup["Full Name"] ||
    signup.fullName ||
    "Unknown Student";

const nameParts =
    fullName.trim().split(/\s+/);

let displayName = fullName;

if (nameParts.length >= 2) {

    const firstName = nameParts[0];

    const lastName =
        nameParts[nameParts.length - 1];

    displayName =
        `${firstName} ${lastName.charAt(0)}.`;

}

targetDay.students.push(displayName);

        }

    });

    buildWeek(
        "currentWeek",
        calendarData.currentWeek
    );

    buildWeek(
        "nextWeek",
        calendarData.nextWeek
    );

}


async function testBackendConnection() {

    try {

        const response =
            await fetch(`${API_URL}?action=health`);

        const data =
            await response.json();

        console.log("MDST Backend Response:", data);

        if (data.success) {

            console.log("✅ MDST website is connected to Google Apps Script.");

        } else {

            console.error("❌ Backend responded, but reported an error.");

        }

    } catch (error) {

        console.error(
            "❌ Could not connect to the MDST backend:",
            error
        );

    }

}


let selectedWeek = "current";


// =====================================================
// MDST - OPEN SIGNUP MODAL
// =====================================================

function openSignupModal(button) {

    const modal =
        document.getElementById("signupModal");

    const daySelect =
        document.getElementById("signupDay");

    const dateInput =
        document.getElementById("signupDate");

    const message =
        document.getElementById("signupMessage");

    selectedWeek =
    button.dataset.week || "current";

const selectedDay =
    button.dataset.day;

const selectedDate =
    button.dataset.date;


/*
 * Disable days that are already full
 */

const week =
    selectedWeek === "current"
        ? calendarData.currentWeek
        : calendarData.nextWeek;

Array.from(daySelect.options).forEach(option => {

    const dayData =
        week.find(day =>
            day.day === option.value
        );

    if (!dayData) {
        return;
    }

    const isFull =
        dayData.students.length >= dayData.capacity;

    option.disabled = isFull;

    if (isFull) {

        option.textContent =
            `${dayData.day} — FULL`;

    } else {

        option.textContent =
            dayData.day;

    }

});


daySelect.value = selectedDay;

dateInput.value = selectedDate;

message.textContent = "";

message.className = "signup-message";

modal.classList.add("show");

}


// =====================================================
// MDST - CLOSE SIGNUP MODAL
// =====================================================

function closeSignupModal() {

    const modal =
        document.getElementById("signupModal");

    modal.classList.remove("show");

}


// =====================================================
// MDST - UPDATE DATE WHEN DAY CHANGES
// =====================================================

function updateSignupDate() {

    const daySelect =
        document.getElementById("signupDay");

    const dateInput =
        document.getElementById("signupDate");

    const week =
        selectedWeek === "current"
            ? calendarData.currentWeek
            : calendarData.nextWeek;

    const selectedDay =
        week.find(day =>
            day.day === daySelect.value
        );

    if (selectedDay) {

        dateInput.value =
            selectedDay.date;

    }

}


// =====================================================
// MDST - SET UP SIGNUP FORM
// =====================================================

function setupSignupForm() {

    const modal =
        document.getElementById("signupModal");

    const closeButton =
        document.getElementById("closeSignupModal");

    const daySelect =
        document.getElementById("signupDay");

    const form =
        document.getElementById("signupForm");


    // -----------------------------
    // Join buttons
    // -----------------------------

    document
        .querySelectorAll(".join-team")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openSignupModal(button);

                }
            );

        });


    // -----------------------------
    // Close button
    // -----------------------------

    closeButton.addEventListener(
        "click",
        closeSignupModal
    );


    // -----------------------------
    // Close when clicking outside
    // -----------------------------

    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {

                closeSignupModal();

            }

        }
    );


    // -----------------------------
    // Update date
    // -----------------------------

    daySelect.addEventListener(
        "change",
        updateSignupDate
    );


    // -----------------------------
    // Submit form
    // -----------------------------

    form.addEventListener(
        "submit",
        handleSignupSubmit
    );
const cancelButton =
    document.getElementById("cancelSignup");

if (cancelButton) {

    cancelButton.addEventListener(
        "click",
        handleCancelSignup
    );

}
}


// =====================================================
// MDST - SUBMIT SIGNUP
// =====================================================

async function handleSignupSubmit(event) {

    event.preventDefault();

    const form = event.target;

    const submitButton =
        document.getElementById("submitSignup");

    const message =
        document.getElementById("signupMessage");

    const fullName =
        document
            .getElementById("signupName")
            .value
            .trim();

    const email =
        document
            .getElementById("signupEmail")
            .value
            .trim()
            .toLowerCase();

    const day =
        document
            .getElementById("signupDay")
            .value;

    const date =
        document
            .getElementById("signupDate")
            .value;


    if (!fullName || !email || !day || !date) {

        message.textContent =
            "Please complete all fields.";

        message.className =
            "signup-message error";

        return;

    }


    submitButton.disabled = true;

    submitButton.textContent =
        "⏳ Joining...";


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },

            body: JSON.stringify({

    action: "signup",

    fullName: fullName,

    email: email,

    date: date,

    day: day

})

        });


        const data =
            await response.json();


        if (!data.success) {

            message.textContent =
                data.error ||
                "We couldn't complete your signup.";

            message.className =
                "signup-message error";

            return;

        }


        message.textContent =
            "🎉 You're on the team!";

        message.className =
            "signup-message success";


        form.reset();


        setTimeout(() => {

            closeSignupModal();

            window.location.reload();

        }, 1000);


    } catch (error) {

        console.error(
            "MDST signup error:",
            error
        );

        message.textContent =
            "We couldn't connect to the signup system. Please try again.";

        message.className =
            "signup-message error";


    } finally {

        submitButton.disabled = false;

        submitButton.textContent =
            "🚀 Join the Team";

    }

}

// =====================================================
// MDST - CANCEL SIGNUP
// =====================================================

async function handleCancelSignup() {

    const message =
        document.getElementById("signupMessage");

    const fullName =
        document
            .getElementById("signupName")
            .value
            .trim();

    const email =
        document
            .getElementById("signupEmail")
            .value
            .trim()
            .toLowerCase();

    const day =
        document
            .getElementById("signupDay")
            .value;

    const date =
        document
            .getElementById("signupDate")
            .value;


    // -----------------------------
    // Validate
    // -----------------------------

    if (
        !fullName ||
        !email ||
        !day ||
        !date
    ) {

        message.textContent =
            "Please enter your name and email first.";

        message.className =
            "signup-message error";

        return;

    }


    // -----------------------------
    // Confirm cancellation
    // -----------------------------

    const confirmed =
        window.confirm(
            `Are you sure you want to cancel your signup for ${day}?`
        );

    if (!confirmed) {

        return;

    }


    const cancelButton =
        document.getElementById("cancelSignup");


    cancelButton.disabled = true;

    cancelButton.textContent =
        "⏳ Cancelling...";


    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body: JSON.stringify({

                    action: "removeSignup",

                    fullName: fullName,

                    email: email,

                    day: day,

                    date: date

                })

            });


        const data =
            await response.json();


        if (!data.success) {

            message.textContent =
                data.error ||
                "We couldn't cancel your signup.";

            message.className =
                "signup-message error";

            return;

        }


        // -----------------------------
        // Success
        // -----------------------------

        message.textContent =
            "✅ Your signup has been cancelled.";

        message.className =
            "signup-message success";


        setTimeout(
            () => {

                closeSignupModal();

                window.location.reload();

            },
            1000
        );


    } catch (error) {

        console.error(
            "MDST cancellation error:",
            error
        );

        message.textContent =
            "We couldn't connect to the signup system. Please try again.";

        message.className =
            "signup-message error";


    } finally {

        cancelButton.disabled = false;

        cancelButton.textContent =
            "Cancel My Signup";

    }

}

// =====================================================
// MDST - TEACHER MANAGEMENT
// =====================================================

function setupTeacherManagement() {

    const button =
        document.getElementById(
            "teacherManagementButton"
        );

    const panel =
        document.getElementById(
            "teacherManagementPanel"
        );

    const closeButton =
        document.getElementById(
            "closeTeacherManagement"
        );


    if (!button || !panel || !closeButton) {
        return;
    }


    // Open teacher panel

    button.addEventListener(
        "click",
        () => {

            panel.classList.add("show");

            loadTeacherRoster();

        }
    );


    // Close teacher panel

    closeButton.addEventListener(
        "click",
        () => {

            panel.classList.remove("show");

        }
    );

}


// =====================================================
// MDST - LOAD TEACHER ROSTER
// =====================================================

// =====================================================
// MDST - LOAD TEACHER ROSTER
// =====================================================

// =====================================================
// MDST - LOAD TEACHER ROSTER
// =====================================================

async function loadTeacherRoster() {

    const roster =
        document.getElementById("teacherRoster");

    if (!roster) {
        return;
    }

    roster.innerHTML =
        "<p>Loading roster...</p>";

    try {

        const signups =
            await loadSignups();


        const dayInfo = {

            Monday: {
                teacher: "Mr. Patterson",
                capacity: 5
            },

            Tuesday: {
                teacher: "Mrs. Smith",
                capacity: 5
            },

            Wednesday: {
                teacher: "Mr. Johnson",
                capacity: 3
            },

            Thursday: {
                teacher: "Mrs. Brown",
                capacity: 5
            },

            Friday: {
                teacher: "Mr. Davis",
                capacity: 5
            }

        };


        const activeSignups =
            signups.filter(
                signup =>
                    String(
                        signup.Status || ""
                    ).toLowerCase() === "active"
            );


        roster.innerHTML = "";


        Object.keys(dayInfo).forEach(day => {

            const info =
                dayInfo[day];


            const dayStudents =
                activeSignups.filter(
                    signup =>
                        String(
                            signup.Day || ""
                        ).trim() === day
                );


            // -----------------------------------------
            // DAY SECTION
            // -----------------------------------------

            const daySection =
                document.createElement("div");

            daySection.className =
                "teacher-day-section";


            // -----------------------------------------
            // DAY HEADER
            // -----------------------------------------

            const dayHeader =
                document.createElement("div");

            dayHeader.className =
                "teacher-day-header";


            const title =
                document.createElement("div");

            title.className =
                "teacher-day-title";

            title.innerHTML =
                `
                <strong>${day}</strong>
                <span>${info.teacher}</span>
                `;


            const count =
                document.createElement("div");

            count.className =
                "teacher-day-count";

            count.textContent =
                `${dayStudents.length}/${info.capacity}`;


            if (
                dayStudents.length >=
                info.capacity
            ) {

                count.classList.add("full");

            }


            dayHeader.appendChild(title);

            dayHeader.appendChild(count);

            daySection.appendChild(dayHeader);


            // -----------------------------------------
            // NO STUDENTS
            // -----------------------------------------

            if (dayStudents.length === 0) {

                const empty =
                    document.createElement("div");

                empty.className =
                    "teacher-empty";

                empty.textContent =
                    "No students signed up.";

                daySection.appendChild(empty);

            }


            // -----------------------------------------
            // STUDENTS
            // -----------------------------------------

            dayStudents.forEach(
                signup => {

                    const student =
                        document.createElement("div");

                    student.className =
                        "teacher-student";


                    // Student information

                    const infoArea =
                        document.createElement("div");

                    infoArea.className =
                        "teacher-student-info";


                    const name =
                        document.createElement("strong");

                    name.textContent =
                        signup["Full Name"] ||
                        "Unknown Student";


                    const date =
                        document.createElement("span");

                    date.className =
                        "teacher-student-date";


                    let displayDate =
                        signup.Date || "";

                    if (displayDate) {

                        const parsedDate =
                            new Date(displayDate);

                        if (
                            !isNaN(
                                parsedDate.getTime()
                            )
                        ) {

                            displayDate =
                                parsedDate.toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short",
                                        day: "numeric"
                                    }
                                );

                        }

                    }


                    date.textContent =
                        displayDate;


                    infoArea.appendChild(name);

                    infoArea.appendChild(date);


                    // ---------------------------------
                    // RIGHT SIDE
                    // ---------------------------------

                    const controls =
                        document.createElement("div");

                    controls.className =
                        "teacher-student-controls";


                    // Active badge

                    const status =
                        document.createElement("span");

                    status.className =
                        "teacher-active-status";

                    status.textContent =
                        "Active";


                    // Cancel button

                    const cancelButton =
                        document.createElement("button");

                    cancelButton.type =
                        "button";

                    cancelButton.className =
                        "teacher-cancel-button";

                    cancelButton.textContent =
                        "Cancel";


                    cancelButton.addEventListener(
                        "click",
                        () => {

                            handleTeacherCancel(
                                signup
                            );

                        }
                    );


                    controls.appendChild(status);

                    controls.appendChild(
                        cancelButton
                    );


                    student.appendChild(infoArea);

                    student.appendChild(controls);


                    daySection.appendChild(
                        student
                    );

                }
            );


            roster.appendChild(
                daySection
            );

        });


    } catch (error) {

        console.error(
            "Teacher roster error:",
            error
        );

        roster.innerHTML =
            `
            <p>
                Unable to load the teacher roster.
            </p>
            `;

    }

}

// =====================================================
// MDST - TEACHER CANCEL SIGNUP
// =====================================================

async function handleTeacherCancel(signup) {

    const studentName =
        signup["Full Name"] ||
        "this student";

    const day =
        String(
            signup.Day || ""
        ).trim();


    const confirmed =
        window.confirm(
            `Are you sure you want to cancel ${studentName}'s signup for ${day}?`
        );


    if (!confirmed) {
        return;
    }


    // -----------------------------------------
    // Convert date to yyyy-MM-dd
    // -----------------------------------------

    let date =
        signup.Date || "";


    const parsedDate =
        new Date(date);


    if (
        !isNaN(
            parsedDate.getTime()
        )
    ) {

        date =
            parsedDate
                .toISOString()
                .slice(0, 10);

    }


    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body: JSON.stringify({

                    action:
                        "removeSignup",

                    fullName:
                        signup["Full Name"],

                    email:
                        signup.Email,

                    day:
                        day,

                    date:
                        date

                })

            });


        const data =
            await response.json();


        if (!data.success) {

            alert(
                data.error ||
                "The signup could not be cancelled."
            );

            return;

        }


        // -----------------------------------------
        // Refresh calendar and teacher roster
        // -----------------------------------------

        await initialize();

        await loadTeacherRoster();


        alert(
            `${studentName}'s signup has been cancelled.`
        );


    } catch (error) {

        console.error(
            "Teacher cancellation error:",
            error
        );


        alert(
            "We couldn't connect to the signup system. Please try again."
        );

    }

}

// =====================================================
// MDST - TEACHER ACCESS
// =====================================================

function setupTeacherAccess() {

    const submitButton =
        document.getElementById("teacherAccessSubmit");

    const input =
        document.getElementById("teacherAccessCode");

    const accessScreen =
        document.getElementById("teacherAccessScreen");

    const dashboard =
        document.getElementById("teacherDashboard");

    const message =
        document.getElementById("teacherAccessMessage");


    if (
        !submitButton ||
        !input ||
        !accessScreen ||
        !dashboard ||
        !message
    ) {

        console.error(
            "MDST: Teacher access elements not found."
        );

        return;
    }


    submitButton.addEventListener(
        "click",
        verifyTeacherCode
    );


    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                verifyTeacherCode();

            }

        }
    );


    async function verifyTeacherCode() {

        const code =
            input.value.trim();


        message.textContent = "";


        if (!code) {

            message.textContent =
                "Please enter the teacher access code.";

            return;

        }


        submitButton.disabled = true;

        submitButton.textContent =
            "Checking...";


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body: JSON.stringify({

                            action:
                                "verifyTeacher",

                            code:
                                code

                        })
                    }
                );


            const data =
                await response.json();


            console.log(
                "MDST Teacher Access Response:",
                data
            );


            if (!data.success) {

                message.textContent =
                    data.error ||
                    "Incorrect teacher access code.";

                input.value = "";

                input.focus();

                return;

            }


            // -----------------------------------------
            // ACCESS GRANTED
            // -----------------------------------------

            accessScreen.style.display =
                "none";

            dashboard.style.display =
                "block";


            if (
                typeof loadTeacherRoster ===
                "function"
            ) {

                await loadTeacherRoster();

            }


        } catch (error) {

            console.error(
                "MDST Teacher Access Error:",
                error
            );


            message.textContent =
                "Unable to verify access. Please try again.";

        } finally {

            submitButton.disabled = false;

            submitButton.textContent =
                "Enter";

        }

    }

}

// =====================================================
// MDST - START APPLICATION
// =====================================================


// =====================================================
// MDST - START APPLICATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log("MDST: Building calendar immediately...");
        console.log("MDST calendar data:", calendarData);

        buildWeek(
            "currentWeek",
            calendarData.currentWeek
        );

        buildWeek(
            "nextWeek",
            calendarData.nextWeek
        );

        setRandomMascot();

        setupSignupForm();

        setupTeacherAccess();

        initialize();

    }
);

