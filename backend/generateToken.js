require('dotenv').config();
const jwt = require('jsonwebtoken');

// Generate a test token
const testToken = jwt.sign({ id: 'test-admin-id' }, process.env.JWT_SECRET, { expiresIn: '7d' });

console.log('\n✅ Copy this token and paste in browser console:\n');
console.log(`localStorage.setItem('adminToken', '${testToken}')`);
console.log('\nThen refresh the page!\n');
