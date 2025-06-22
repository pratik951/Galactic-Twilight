import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';

// Mock axios
jest.mock('axios');

function AICaption({ apod }) {
  const [caption, setCaption] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const generateCaption = async () => {
    setLoading(true);
    setError(null);
    setCaption('');
    try {
      const res = await axios.post('http://localhost:5000/api/ai-caption', {
        title: apod.title,
        explanation: apod.explanation
      });
      setCaption(res.data.caption);
    } catch (err) {
      setError('Failed to generate AI caption.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generateCaption} disabled={loading}>
        {loading ? 'Generating...' : 'Generate AI Caption'}
      </button>
      {error && <p>{error}</p>}
      {caption && <div>{caption}</div>}
    </div>
  );
}

export default AICaption;
