const fs = require('fs');
const https = require('https');
const path = require('path');

const API_URL = 'https://savenepal-corruption.onrender.com/api/complaints';
const ADMIN_PWD = 'Rp369#og33';
const DOWNLOAD_DIR = path.join(__dirname, 'Downloaded_Data');

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

console.log('🔄 Connecting to Save Nepal From Corruption Cloud Server...');

const options = {
  headers: { 'x-admin-password': ADMIN_PWD }
};

https.get(API_URL, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error('❌ Failed to pull data. Server responded with HTTP ' + res.statusCode);
      if (res.statusCode === 401) console.error('   Error: Admin password rejected. Was it changed?');
      return;
    }
    try {
      const complaints = JSON.parse(data);
      const jsonPath = path.join(DOWNLOAD_DIR, 'all_complaints.json');
      fs.writeFileSync(jsonPath, JSON.stringify(complaints, null, 2));
      console.log(`✅ Successfully downloaded ${complaints.length} complaints!`);
      console.log(`📂 Data securely saved to folder: ${DOWNLOAD_DIR}`);
      
      if (complaints.length > 0) {
        const csvPath = path.join(DOWNLOAD_DIR, 'complaints_excel.csv');
        let csv = 'ID,Date,Reporter,Phone,Status,Urgency,Province,District,Municipality,Ward,Categories,Title\n';
        complaints.forEach(c => {
          const cat = Array.isArray(c.categories) ? c.categories.join(' & ') : (c.category || '');
          const row = `"${c.id}","${new Date(c.timestamp).toLocaleString()}","${c.reporter?.name || ''}","${c.reporter?.phone || ''}","${c.status}","${c.urgency}","${c.location?.province || ''}","${c.location?.district || ''}","${c.location?.municipality || ''}","${c.location?.ward || ''}","${cat}","${(c.title || '').replace(/"/g, '""')}"`;
          csv += row + '\n';
        });
        fs.writeFileSync(csvPath, csv);
        console.log(`📊 Also saved as an Excel readable CSV file: complaints_excel.csv`);
      }
    } catch (e) {
      console.error('❌ Error parsing the cloud data:', e.message);
    }
  });
}).on('error', err => {
  console.error('❌ Network Error:', err.message);
  console.error('   Please check your internet connection.');
});
