// ---------- Get the elements we need from the page ----------
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

// ---------- Helper: today's date as "YYYY-MM-DD" ----------
function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  // padStart makes sure we get "05" instead of "5"
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Stop the date picker from allowing future dates
dobInput.max = getTodayString();

// ---------- Calculate button ----------
calculateBtn.addEventListener("click", function () {
  errorText.textContent = "";          // clear old error
  resultSection.classList.add("hidden"); // hide old result

  // 1. Check that a date was entered
  if (dobInput.value === "") {
    errorText.textContent = "Please enter your date of birth.";
    return;
  }

  // 2. Split "YYYY-MM-DD" into numbers
  const parts = dobInput.value.split("-");
  const birthYear = Number(parts[0]);
  const birthMonth = Number(parts[1]); // 1 to 12
  const birthDay = Number(parts[2]);

  // Today's date as numbers
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1; // JavaScript months start at 0, so add 1
  const todayDay = today.getDate();

  // 3. Check for invalid or unrealistic dates
  if (isNaN(birthYear) || isNaN(birthMonth) || isNaN(birthDay) || birthYear < 1900) {
    errorText.textContent = "Please enter a valid date (year 1900 or later).";
    return;
  }

  // 4. Check that the date is not in the future
  // Comparing "YYYY-MM-DD" text works because the format sorts correctly
  if (dobInput.value > getTodayString()) {
    errorText.textContent = "Date of birth cannot be in the future.";
    return;
  }

  // 5. Subtract birth date from today's date
  let years = todayYear - birthYear;
  let months = todayMonth - birthMonth;
  let days = todayDay - birthDay;

  // 6. If days are negative, borrow days from the previous month.
  // new Date(year, month, 0) gives the LAST day of the previous month,
  // which is also that month's length (28, 29, 30 or 31).
  // This is what handles leap years and different month lengths.
  if (days < 0) {
    months = months - 1;
    const daysInPreviousMonth = new Date(todayYear, todayMonth - 1, 0).getDate();
    days = days + daysInPreviousMonth;
  }

  // 7. If months are negative, borrow 12 months from the years
  if (months < 0) {
    years = years - 1;
    months = months + 12;
  }

  // 8. Total completed months = full years * 12 + remaining months
  const totalMonths = years * 12 + months;

  // 9. Total days elapsed.
  // Date.UTC avoids problems with daylight saving time.
  // One day has 24 * 60 * 60 * 1000 milliseconds.
  const birthTime = Date.UTC(birthYear, birthMonth - 1, birthDay);
  const todayTime = Date.UTC(todayYear, todayMonth - 1, todayDay);
  const totalDays = Math.round((todayTime - birthTime) / (24 * 60 * 60 * 1000));

  // 10. Show the results on the page
  yearsText.textContent = years;
  monthsText.textContent = months;
  daysText.textContent = days;
  totalMonthsText.textContent = totalMonths.toLocaleString();
  totalDaysText.textContent = totalDays.toLocaleString();
  resultSection.classList.remove("hidden");
});

// ---------- Reset button ----------
resetBtn.addEventListener("click", function () {
  dobInput.value = "";
  errorText.textContent = "";
  resultSection.classList.add("hidden");
});
