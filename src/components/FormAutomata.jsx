import React, { useState } from 'react';
import axios from 'axios';

const FormAutomata = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);


  const handleTextChange = (e) => setText(e.target.value);
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('text', text);
    if (file) formData.append('file', file);

    try {
      const { data } = await axios.post('http://localhost:8000/analyze/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResponse(`Texto analizado: ${data.text_analysis}\nArchivo analizado: ${data.file_analysis}`);
    } catch (error) {
      setResponse('Error al procesar la solicitud.');
      console.error('Error al enviar los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-2/3 flex flex-col items-center justify-center bg-gray-800">
        <h1 className="text-3xl font-semibold mb-4">Lenguajes y Autómatas</h1>
        <h2 className="text-xl font-light">Analizador de Matrículas</h2>
      </div>

      
      <div className="w-2/3 p-8 flex items-center justify-center bg-gray-900">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <label htmlFor="text" className="block text-sm font-semibold mb-2">Texto cadena:</label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={handleTextChange}
              className="w-full p-3 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa una cadena de texto"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="file" className="block text-sm font-semibold mb-2">Cargar archivo:</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full p-3 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className={`w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Enviar'}
            </button>
          </div>
          <div className="mt-6">
            <p className="whitespace-pre-wrap">{response}</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAutomata;
