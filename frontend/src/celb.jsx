import React, { useState, useEffect } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Kholi from './Kohli.jpeg';
import messi from './LIONEL MESSI.jpeg';
import maria from './Maria Sharapova.jpeg';
import roger from './ROGER FEDERER.jpeg';
import sareena from './Serena Williams.jpeg';
import './predict.css';
import DropzoneComponent from './drop.jsx';
import Particlesss from './Component/ParticlesBackground.js';

export default function CelebrityPrediction() {
  const [apiResult, setApiResult] = useState([]);
  const [noPredictionMessage, setNoPredictionMessage] = useState(''); // State for no prediction message

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const onDrop = (acceptedFiles, setFieldValue) => {
    const file = acceptedFiles[0];
    setFieldValue('image', file);
  };

  const clearPrediction = () => {
    setApiResult([]);
    setNoPredictionMessage(''); // Clear the no prediction message
  };

  const validation = (values) => {
    const errors = {};
    if (!values.image) {
      errors.image = 'Please upload an image';
    }
    return errors;
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/classify_image', { image: values.image });

      // Filter results to only include unique celebrity names
      const uniqueResults = [];
      const seenCelebrities = new Set();

      const resultArray = Array.isArray(response.data) ? response.data : [response.data];
      resultArray.forEach(result => {
        const celebrityName = result.class.replace('_', ' ').toUpperCase();
        if (!seenCelebrities.has(celebrityName)) {
          seenCelebrities.add(celebrityName);
          uniqueResults.push(result);
        }
      });

      if (uniqueResults.length === 0) {
        setNoPredictionMessage('Could not predict any face.'); // Set message if no predictions
      } else {
        setNoPredictionMessage(''); // Clear message if predictions exist
      }

      setApiResult(uniqueResults);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const celebrityImages = {
    'LIONEL MESSI': messi,
    'MARIA SHARAPOVA': maria,
    'ROGER FEDERER': roger,
    'SERENA WILLIAMS': sareena,
    'VIRAT KOHLI': Kholi,
  };

  return (
    <div className="form-container">
      <div className="particles-container">
        <Particlesss />
      </div>

      <div className="image-container background-image">
        {Object.entries(celebrityImages).map(([name, src], index) => (
          <div key={index} className="image-item" data-aos="fade-up">
            <img src={src} alt={name} className="round-image" />
            <p>{name}</p>
          </div>
        ))}
      </div>

      <div className="gif-background" data-aos="fade-up">
        <h2>Celebrity Prediction</h2>
        <Formik
          initialValues={{ image: null }}
          validate={validation}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="image">Upload an Image</label>
                <DropzoneComponent setFieldValue={setFieldValue} clearPrediction={clearPrediction} />
                <ErrorMessage name="image" component="div" className="alert alert-warning" />
              </div>

              <button type="submit" disabled={isSubmitting} className="submit-button">
                {isSubmitting ? 'Submitting...' : 'Classify'}
              </button>
            </Form>
          )}
        </Formik>

        {noPredictionMessage && <div className="no-prediction-message">{noPredictionMessage}</div>} {/* Display message if no predictions */}

        {Array.isArray(apiResult) && apiResult.length > 0 && (
          <div className="results-container">
            {apiResult.map((result, idx) => (
              <div key={idx} className="result-block">
                <div className="prediction-header">
                  <h3>Prediction {idx + 1}: {result.class.replace('_', ' ').toUpperCase()}</h3>
                  {celebrityImages[result.class.replace('_', ' ').toUpperCase()] && (
                    <img
                      src={celebrityImages[result.class.replace('_', ' ').toUpperCase()]}
                      alt={result.class}
                      className="result-image"
                    />
                  )}
                </div>
                <table className="result-table">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Probability Score (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.class_dictionary &&
                      Object.keys(result.class_dictionary).map((celebrity, index) => (
                        <tr key={index}>
                          <td>{celebrity.replace('_', ' ').toUpperCase()}</td>
                          <td>{result.class_probability[index]?.toFixed(2) || 'N/A'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
