import React, { useState } from 'react';
import { TextField, Button, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import XLSX for Excel export
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sponsoredDomains, setSponsoredDomains] = useState([]); // Store sponsored domains
  const [error, setError] = useState(null); // Store errors
  const [inputError, setInputError] = useState(''); // Input validation error
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setInputError(''); // Clear error on input change
  };

  const handleButtonClick = async () => {
    if (inputValue.trim() === '') {
      setInputError('Please enter a valid key');
      return;
    }

    setLoading(true);
    setError(null);
    setSponsoredDomains([]); // Reset sponsored domains
    setQuery('');

    try {
      const response = await axios.post(
        'http://localhost:5004/api/v1/search',
        { query: inputValue } // Sending query in the body
      );
      console.log(inputValue);

      // Check if response is successful
      if (response.data.success && response.data.data) {
        setSponsoredDomains(response.data.data.sponsoredDomains || []);
        setQuery(response.data.data.query); // Store the query
      } else {
        setError('Failed to fetch sponsored domains.');
      }
    } catch (error) {
      setError('Error fetching data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleExportExcel = () => {
  //   if (sponsoredDomains.length === 0) {
  //     setError('No data to export.');
  //     return;
  //   }
  //   const pageCount = Math.ceil(sponsoredDomains.length / 9); // Assuming 9 domains per page as per `pagesLinkLength`

  // const dataForExport = [
  //   { Query: `Query: ${query}`, Domain: '', Pages: '' }, // Include the query
  //   { Query: '', Domain: '', Pages: `Page Count: ${pageCount}` }, // Add page count
  //   ...sponsoredDomains.map((domain) => ({ Query: '', Domain: domain, Pages: '' })), // Append domains
  // ];
  //   const worksheet = XLSX.utils.json_to_sheet(dataForExport);

  //   // Create a workbook and append the worksheet
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sponsored Domains');
  
  //   // Export the workbook to an Excel file
  //   XLSX.writeFile(workbook, 'sponsored_domains.xlsx');
  // };

  const handleExportExcel = () => {
    if (sponsoredDomains.length === 0) {
      setError('No data to export.');
      return;
    }

    // Create a worksheet from the sponsoredDomains array
    const worksheet = XLSX.utils.json_to_sheet(
      sponsoredDomains.map((domain) => ({ Domain: domain }))
    );
    
    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sponsored Domains');
    
    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, 'sponsored_domains.xlsx');
  };


  return (
    <div className="App">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="20vh"
        flexDirection="row"
        gap={2}
      >
        <TextField
          label="Enter Your Key"
          variant="outlined"
          value={inputValue}
          onChange={handleInputChange}
          sx={{ maxWidth: '700px', flex: 1 }}
          error={!!inputError}
          helperText={inputError}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleButtonClick}
          disabled={loading}
          sx={{ maxWidth: '250px', height: '56px' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
        </Button>
      </Box>

      {/* Display error if any */}
      {error && <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>}

      {/* Display sponsored domains */}
      {sponsoredDomains.length > 0 && (
        <div>
        <div>
        <Button
            variant="contained"
            color="secondary"
            onClick={handleExportExcel}
            sx={{ marginTop: '20px' }}
          >
            Export to Excel
          </Button>
    <h3>Sponsored Domains:</h3>
    
    <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'center' }}>
      <thead>
        <tr>
          <th>Index</th>
          <th>Domain</th>
        </tr>
      </thead>
      <tbody>
        {sponsoredDomains.map((domain, index) => (
          <tr key={index}>
            <td>{index + 1}</td> {/* Show index starting from 1 */}
            <td>
              <a href={domain} target="_blank" rel="noopener noreferrer">
                {domain}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
   
  </div>

          {/* Export button */}
         
        </div>
      )}
    </div>
  );
}

export default App;
