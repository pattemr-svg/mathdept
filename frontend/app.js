/*
==========================================
MDST
Math Department Service Team
Version 0.2
==========================================
*/
const API_URL = "https://script.google.com/macros/s/AKfycbxdvPcTVo1AxbKQosOza-6PmlKUYBqiUrVY-0c-HdUxziiziPHKqEU1XYp2nTd_2Xn24A/exec";
const calendarData = {

    currentWeek: [

        {
            day: "Monday",
            teacher: "Mr. Patterson",
            capacity: 5,
            students: [
                "Sarah P.",
                "James R.",
                "Emily T."
            ]
        },

        {
            day: "Tuesday",
            teacher: "Mrs. Smith",
            capacity: 5,
            students: [
                "Olivia B.",
                "Tyler C."
            ]
        },

        {
            day: "Wednesday",
            teacher: "Mr. Johnson",
            capacity: 3,
            students: [
                "Ava L."
            ]
        },

        {
            day: "Thursday",
            teacher: "Mrs. Brown",
            capacity: 5,
            students: [
            ]
        },

        {
            day: "Friday",
            teacher: "Mr. Davis",
            capacity: 5,
            students: [
                "Mason R.",
                "Emma H.",
                "Luke T.",
                "Grace W."
            ]
        }

    ],

    nextWeek: [

        {
            day: "Monday",
            teacher: "Mr. Patterson",
            capacity: 5,
            students: [
            ]
        },

        {
            day: "Tuesday",
            teacher: "Mrs. Smith",
            capacity: 5,
            students: [
                "Sarah P."
            ]
        },

        {
            day: "Wednesday",
            teacher: "Mr. Johnson",
            capacity: 3,
            students: [
                "Noah K.",
                "James R."
            ]
        },

        {
            day: "Thursday",
            teacher: "Mrs. Brown",
            capacity: 5,
            students: [
                "Olivia B.",
                "Emma H."
            ]
        },

        {
            day: "Friday",
            teacher: "Mr. Davis",
            capacity: 5,
            students: [
            ]
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

        container.appendChild(template);

    });

}


function initialize(){

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


document.addEventListener("DOMContentLoaded", () => {

    initialize();

    testBackendConnection();

    document.querySelectorAll(".join-team").forEach(button => {

        button.addEventListener("click", () => {

            alert(
                "Join Team functionality will be connected to Google Sheets next."
            );

        });

    });

});