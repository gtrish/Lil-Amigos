import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '10px' }}>404</h1>
      <h2 style={{ marginBottom: '20px' }}>Oops! Page Not Found</h2>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>
        It looks like this little adventure got lost.
      </p>
      <Link to="/" style={{ padding: '15px 30px', backgroundColor: 'black', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;