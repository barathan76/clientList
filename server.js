const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001; 


app.use(cors());


app.get('/api/assignment', async (req, res) => {
  try {
    const response = await axios.get(
      'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=client_data'
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data from the API.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
