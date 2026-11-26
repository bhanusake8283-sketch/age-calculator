// =====================================================
//  SHARED HELPERS (used by both "My Age" and "Age Gap")
// =====================================================

// Today's date as "YYYY-MM-DD"
function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  // padStart makes sure we get "05" instead of "5"
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Checks one date text. Returns an error message, or "" if the date is fine.
function checkDate(dateText) {
  if (dateText === "") {
    return "Please enter a date of birth.";
  }
  const year = Number(dateText.split("-")[0]);
  if (isNaN(year) || year < 1900) {
    return "Please enter a valid date (year 1900 or later).";
  }
  // Comparing "YYYY-MM-DD" text works because the format sorts correctly
  if (dateText > getTodayString()) {
    return "A date of birth cannot be in the future.";
  }
  return "";
}

// THE MAIN CALCULATION. It finds the difference between two dates.
// fromText = the earlier date, toText = the later date (both "YYYY-MM-DD").
// "My Age" uses it with (birth date, today).
// "Age Gap" uses it with (older person's birth date, younger person's birth date).
function getDifference(fromText, toText) {
  // Split "YYYY-MM-DD" into numbers
  const from = fromText.split("-");
  const fromYear = Number(from[0]);
  const fromMonth = Number(from[1]); // 1 to 12
  const fromDay = Number(from[2]);

  const to = toText.split("-");
  const toYear = Number(to[0]);
  const toMonth = Number(to[1]);
  const toDay = Number(to[2]);

  // Subtract the two dates
  let years = toYear - fromYear;
  let months = toMonth - fromMonth;
  let days = toDay - fromDay;

  // If days are negative, borrow days from the previous month.
  // new Date(year, month, 0) gives the LAST day of the previous month,
  // which is also that month's length (28, 29, 30 or 31).
  // This is what handles leap years and different month lengths.
  if (days < 0) {
    months = months - 1;
    const daysInPreviousMonth = new Date(toYear, toMonth - 1, 0).getDate();
    // If the starting day is bigger than that month's length (for example the
    // 31st, but the previous month has only 29 days), use the month's last day.
    // Without this the days could come out negative.
    const startDay = Math.min(fromDay, daysInPreviousMonth);
    days = toDay - startDay + daysInPreviousMonth;
  }

  // If months are negative, borrow 12 months from the years
  if (months < 0) {
    years = years - 1;
    months = months + 12;
  }

  // Total completed months = full years * 12 + remaining months
  const totalMonths = years * 12 + months;

  // Total days between the two dates.
  // Date.UTC avoids problems with daylight saving time.
  // One day has 24 * 60 * 60 * 1000 milliseconds.
  const fromTime = Date.UTC(fromYear, fromMonth - 1, fromDay);
  const toTime = Date.UTC(toYear, toMonth - 1, toDay);
  const totalDays = Math.round((toTime - fromTime) / (24 * 60 * 60 * 1000));

  // Send all the answers back
  return {
    years: years,
    months: months,
    days: days,
    totalMonths: totalMonths,
    totalDays: totalDays
  };
}

// =====================================================
//  TABS (switch between "My Age" and "Age Gap")
// =====================================================
const tabAge = document.getElementById("tabAge");
const tabGap = document.getElementById("tabGap");
const agePanel = document.getElementById("agePanel");
const gapPanel = document.getElementById("gapPanel");

tabAge.addEventListener("click", function () {
  agePanel.classList.remove("hidden");
  gapPanel.classList.add("hidden");
  tabAge.classList.add("active");
  tabGap.classList.remove("active");
});

tabGap.addEventListener("click", function () {
  gapPanel.classList.remove("hidden");
  agePanel.classList.add("hidden");
  tabGap.classList.add("active");
  tabAge.classList.remove("active");
});

// =====================================================
//  TAB 1: MY AGE
// =====================================================
const dobInput = document.getElementById("dob");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const errorText = document.getElementById("error");
const resultSection = document.getElementById("result");

const yearsText = document.getElementById("years");
const monthsText = document.getElementById("months");
const daysText = document.getElementById("days");
const totalMonthsText = document.getElementById("totalMonths");
const totalDaysText = document.getElementById("totalDays");

// Stop the date picker from allowing future dates
dobInput.max = getTodayString();

calculateBtn.addEventListener("click", function () {
  errorText.textContent = "";            // clear old error
  resultSection.classList.add("hidden"); // hide old result

  // Check the date first
  const problem = checkDate(dobInput.value);
  if (problem !== "") {
    errorText.textContent = problem;
    return;
  }

  // Age = difference between birth date and today
  const age = getDifference(dobInput.value, getTodayString());

  // Show the results on the page
  yearsText.textContent = age.years;
  monthsText.textContent = age.months;
  daysText.textContent = age.days;
  totalMonthsText.textContent = age.totalMonths.toLocaleString();
  totalDaysText.textContent = age.totalDays.toLocaleString();
  resultSection.classList.remove("hidden");
});

resetBtn.addEventListener("click", function () {
  dobInput.value = "";
  errorText.textContent = "";
  resultSection.classList.add("hidden");
});

// Pressing Enter in the date box also calculates
dobInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    calculateBtn.click();
  }
});

// =====================================================
//  TAB 2: AGE GAP
// =====================================================
const nameAInput = document.getElementById("nameA");
const nameBInput = document.getElementById("nameB");
const dobAInput = document.getElementById("dobA");
const dobBInput = document.getElementById("dobB");
const gapBtn = document.getElementById("gapBtn");
const gapResetBtn = document.getElementById("gapResetBtn");
const gapError = document.getElementById("gapError");
const gapResult = document.getElementById("gapResult");
const gapSentence = document.getElementById("gapSentence");

const gapYears = document.getElementById("gapYears");
const gapMonths = document.getElementById("gapMonths");
const gapDays = document.getElementById("gapDays");
const gapTotalDays = document.getElementById("gapTotalDays");

// Stop both date pickers from allowing future dates
dobAInput.max = getTodayString();
dobBInput.max = getTodayString();

gapBtn.addEventListener("click", function () {
  gapError.textContent = "";
  gapResult.classList.add("hidden");

  // 1. Check both dates
  const problemA = checkDate(dobAInput.value);
  if (problemA !== "") {
    gapError.textContent = "Person A: " + problemA;
    return;
  }
  const problemB = checkDate(dobBInput.value);
  if (problemB !== "") {
    gapError.textContent = "Person B: " + problemB;
    return;
  }

  // 2. Use the typed names, or "Person A" / "Person B" if left empty
  const nameA = nameAInput.value.trim() || "Person A";
  const nameB = nameBInput.value.trim() || "Person B";

  // 3. Same birth date means there is no gap
  if (dobAInput.value === dobBInput.value) {
    gapSentence.textContent = nameA + " and " + nameB + " have the same birth date. No age gap!";
    gapYears.textContent = 0;
    gapMonths.textContent = 0;
    gapDays.textContent = 0;
    gapTotalDays.textContent = 0;
    gapResult.classList.remove("hidden");
    return;
  }

  // 4. Find who is older. The EARLIER birth date belongs to the older person.
  let olderName = nameA;
  let youngerName = nameB;
  let olderDate = dobAInput.value;
  let youngerDate = dobBInput.value;

  if (dobBInput.value < dobAInput.value) {
    olderName = nameB;
    youngerName = nameA;
    olderDate = dobBInput.value;
    youngerDate = dobAInput.value;
  }

  // 5. The gap = difference between the two birth dates
  const gap = getDifference(olderDate, youngerDate);

  // 6. Show the results on the page
  gapSentence.textContent = olderName + " is older than " + youngerName + " by:";
  gapYears.textContent = gap.years;
  gapMonths.textContent = gap.months;
  gapDays.textContent = gap.days;
  gapTotalDays.textContent = gap.totalDays.toLocaleString();
  gapResult.classList.remove("hidden");
});

gapResetBtn.addEventListener("click", function () {
  nameAInput.value = "";
  nameBInput.value = "";
  dobAInput.value = "";
  dobBInput.value = "";
  gapError.textContent = "";
  gapResult.classList.add("hidden");
});

// Pressing Enter in any Age Gap box also calculates
[nameAInput, nameBInput, dobAInput, dobBInput].forEach(function (box) {
  box.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      gapBtn.click();
    }
  });
});
