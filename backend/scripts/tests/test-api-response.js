const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/research/a2936fbb-17b3-4c2f-b5fd-808482439630',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    // Add a test authorization if needed
    'Authorization': 'Bearer test-token'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log('\n=== API RESPONSE CHECK ===');
      console.log('Success:', json.success);
      console.log('Volume:', json.data?.volume);
      console.log('NAAS Rating:', json.data?.naasRating);
      console.log('Indexing Categories:', json.data?.indexingCategories);
      console.log('Issue:', json.data?.issue);
      console.log('Page Numbers:', json.data?.pageNumbers);
      console.log('DOI:', json.data?.doi);
      
      if (!json.success) {
        console.log('\nError message:', json.message);
      }
    } catch (e) {
      console.log('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();
