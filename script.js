
const carnegieSheetId = '1O3wyUccqB4tjIj9Vle6tY4UHXf22x9Q9yaSuWO8480c';
const carnegieTab = 'Carnegie Waitlist';
const cranberrySheetId = '1I5s3EPTT0JdeJcUtVAYR7oSuzDYtRgC6DQVtFxkjAiY';
const cranberryTab = 'Cranberry Waitlist & Goals';

const carnegieUrl = `https://docs.google.com/spreadsheets/d/${carnegieSheetId}/gviz/tq?sheet=${encodeURIComponent(carnegieTab)}&tqx=out:json`;
const cranberryUrl = `https://docs.google.com/spreadsheets/d/${cranberrySheetId}/gviz/tq?sheet=${encodeURIComponent(cranberryTab)}&tqx=out:json`;

async function fetchSheetData(url) {
  const res = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.substr(47).slice(0, -2));
  return json.table;
}

function generateTableHtml(columns, rows) {
  let html = '<table><thead><tr>';
  columns.forEach(col => {
    html += `<th>${col.label}</th>`;
  });
  html += '</tr></thead><tbody>';
  rows.forEach(row => {
    html += '<tr>';
    row.c.forEach(cell => {
      html += `<td>${cell ? cell.v : ''}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

async function updateWaitlists() {
  try {
    const [carnegieTable, cranberryTable] = await Promise.all([
      fetchSheetData(carnegieUrl),
      fetchSheetData(cranberryUrl)
    ]);

    document.getElementById('carnegie-table').innerHTML = generateTableHtml(carnegieTable.cols, carnegieTable.rows);
    document.getElementById('cranberry-table').innerHTML = generateTableHtml(cranberryTable.cols, cranberryTable.rows);

    const lastUpdatedCell = carnegieTable.rows[0]?.c[0]?.v || 'Unknown Date';
    document.getElementById('lastUpdated').innerText = `Last Updated: ${lastUpdatedCell}`;
  } catch (err) {
    console.error('Error fetching waitlists:', err);
    document.getElementById('carnegie-table').innerText = 'Failed to load Carnegie waitlist.';
    document.getElementById('cranberry-table').innerText = 'Failed to load Cranberry waitlist.';
  }
}

updateWaitlists();
setInterval(updateWaitlists, 30000);
