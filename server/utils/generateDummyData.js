const XLSX = require('xlsx');
const path = require('path');

const generateDump = (filename, totalNumbers, commonNumbers) => {
  const numbers = [...commonNumbers];
  while (numbers.length < totalNumbers) {
    numbers.push(`91${Math.floor(7000000000 + Math.random() * 2999999999)}`);
  }

  // Shuffle
  numbers.sort(() => Math.random() - 0.5);

  const rows = numbers.map(num => ({
    msisdn: num,
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    tower_id: filename.replace('.xlsx', ''),
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'TowerDump');
  XLSX.writeFile(wb, path.join(__dirname, '../../data', filename));
  console.log(`Generated ${filename} with ${rows.length} records`);
};

// These numbers appear in ALL dumps — they are our "suspects"
const commonNumbers = [
  '919876543210',
  '919845012345',
  '919911223344',
  '919732112233',
  '919600001111',
];

generateDump('tower_dump_A.xlsx', 500, commonNumbers);
generateDump('tower_dump_B.xlsx', 600, commonNumbers);
generateDump('tower_dump_C.xlsx', 450, commonNumbers);

console.log('All dummy files generated in /data folder');