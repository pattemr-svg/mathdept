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

joinButton.dataset.date = day.date;
joinButton.dataset.day = day.day;

joinButton.dataset.week =
    containerId === "currentWeek"
        ? "current"
        : "next";
        container.appendChild(template);

    });

}


async function initialize() {

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
// MDST - START APPLICATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await initialize();

        testBackendConnection();

        setupSignupForm();

    }
);