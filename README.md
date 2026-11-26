# Age Calculator

A simple web app built with plain HTML, CSS and JavaScript. No frameworks, no libraries, no internet needed.

## Features

### My Age
- Enter your date of birth and click **Calculate Age**
- Shows your exact age in **years, months and days**
- Shows **total completed months** and **total days elapsed**
- **Reset** button clears everything

### Age Gap
- Enter the birth dates of two people (names are optional)
- Shows **who is older** and the gap in **years, months and days**
- Shows the gap in **total days**
- Shows "No age gap!" if both dates are the same

### Other
- Future dates and invalid dates are blocked, with a clear error message
- Handles leap years and months with different lengths
- Press **Enter** to calculate
- Works on mobile and desktop
- Colorful design with simple 3D effects

## Project Files

| File | What it does |
|------|--------------|
| `index.html` | The page structure (tabs, inputs, buttons, result boxes) |
| `style.css` | Colors, layout and 3D effects |
| `script.js` | The age and age gap calculations |
| `favicon.ico`, `favicon-*.png`, `apple-touch-icon.png` | The small icon shown in the browser tab |

## How to Run (Windows + VS Code)

1. **Extract** the zip file (right-click, then **Extract All...**).
2. Open **VS Code**, then go to **File > Open Folder...** and choose the `age-calculator` folder.
3. Install the **Live Server** extension:
   - Press `Ctrl + Shift + X`
   - Search for **Live Server** (by Ritwick Dey)
   - Click **Install**
4. Open `index.html`, right-click in the code and choose **Open with Live Server**
   (or click **Go Live** at the bottom right).
5. Your browser opens the app, usually at `http://127.0.0.1:5500`.
   The page refreshes automatically whenever you save a file.
6. To stop it, click **Port: 5500** at the bottom of VS Code.

> Tip: you can also just double-click `index.html` to open it in your browser. Live Server only adds auto-refresh.

## How the Age Calculation Works

All the date math is in one function in `script.js`:

```js
getDifference(fromDate, toDate)
```

- **My Age** uses it with *(birth date, today)*
- **Age Gap** uses it with *(older person's birth date, younger person's birth date)*

Steps inside the function:
1. Subtract the years, months and days.
2. If the days are negative, borrow days from the previous month. `new Date(year, month, 0).getDate()` gives that month's length, which handles leap years and 28/29/30/31-day months.
3. If the months are negative, borrow 12 months from the years.
4. Total days use `Date.UTC`, so daylight saving time cannot change the answer.

## Test Dates to Try

| Test | Expected |
|------|----------|
| Birth date `29-02-2000` | A valid leap day, and a result is shown |
| Today's date | 0 years, 0 months, 0 days |
| A future date | Blocked by the date picker, or shows an error |
| Age Gap: `31-01-2000` and `01-03-2000` | 1 month, 1 day |
| Age Gap: the same date twice | "No age gap!" |

## Ideas to Improve It

- Next birthday countdown
- Dark mode toggle
- Zodiac sign and generation
- Copy result to clipboard
- Save the last date with `localStorage`

## Tech Used

- HTML5
- CSS3 (gradients, animations, flexbox)
- Vanilla JavaScript (no libraries)

Made as a beginner project.
