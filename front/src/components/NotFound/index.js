import React from 'react';
import { Button } from '@mui/material';

function NotFound() {
  return (
    <div style={{ textAlign: 'center' }}>
      {/* <h1>404</h1>
      <p>Oops, the page you're looking for cannot be found</p> */}
      {/* <img src="https://lh6.googleusercontent.com/Bu-pRqU_tWZV7O3rJ5nV1P6NjqFnnAs8kVLC5VGz_Kf7ws0nDUXoGTc7pP87tyUCfu8VyXi0YviIm7CxAISDr2lJSwWwXQxxz98qxVfMcKTJfLPqbcfhn-QEeOowjrlwX1LYDFJN" alt="404 error" /> */}
      <img style={{width:600, "padding-top": "1em"}} src="https://blog.thomasnet.com/hubfs/shutterstock_774749455.jpg" alt="404 Error: Not Found"/>
      <Button variant="contained" onClick={() => window.history.back()}>Go back</Button>
    </div>
  );
}

export default NotFound;
