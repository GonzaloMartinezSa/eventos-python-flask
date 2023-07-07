import React from 'react';
import { Button } from '@mui/material';

function TooManyRequests() {
  return (
    <div style={{ textAlign: 'center' }}>
      {/* <h1>404</h1>
      <p>Oops, the page you're looking for cannot be found</p> */}
      <img style={{width:600, "padding-top": "1em"}} src="https://cdn3.wpbeginner.com/wp-content/uploads/2018/02/429error.png" alt="404 error" />
      <Button variant="contained" onClick={() => window.history.back()}>Go back</Button>
    </div>
  );
}

export default TooManyRequests;
