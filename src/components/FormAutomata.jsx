import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const FormAutomata = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => setText(e.target.value);

  // Manejar archivos con Dropzone, aceptando solo .txt, .doc, y .pdf
  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/pdf': ['.pdf']
    }
  });

  // Enviar solo el texto
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:8000/analyze-text/', { text });
      setResponse(`Texto analizado: ${data.text_analysis}`);
    } catch (error) {
      setResponse('Error al analizar el texto.');
      console.error('Error al enviar el texto:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enviar solo el archivo
  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await axios.post('http://localhost:8000/analyze-file/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResponse(`Archivo analizado: ${data.file_analysis}`);
    } catch (error) {
      setResponse('Error al analizar el archivo.');
      console.error('Error al enviar el archivo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[url('/rose.jpeg')] bg-cover bg-center text-gray-300">
      
      {/* Sección izquierda con títulos descriptivos */}
      <div className="w-1/2 flex flex-col justify-center items-start px-12 ">
        <h1 className="text-5xl font-semibold mb-6 leading-tight text-gray-100">Explora el poder del análisis del autómata</h1>
        <p className="text-lg font-light mb-8 text-gray-400">
          Subir cadenas de texto o archivos nunca ha sido tan fácil. Descubre patrones y analiza de manera eficiente.
        </p>
      </div>

      {/* Formulario minimalista con transparencia */}
      <div className="w-1/2 flex items-center justify-center">
        <form className="w-full max-w-md p-8 rounded-lg bg-black/70 backdrop-blur-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-100">Formulario de análisis de texto</h2>
          <p className="mb-6 text-gray-400">
            Ingresa una cadena de texto o sube un archivo para procesar. Nuestra herramienta analizará el contenido de manera precisa.
          </p>

          {/* Input de texto */}
          <div className="mb-6">
            <label htmlFor="text" className="block text-sm font-medium mb-2 text-gray-400">Ingresa tu texto</label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={handleTextChange}
              className="w-full p-3 rounded-lg bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Escribe aquí la cadena de texto"
            />
          </div>

          {/* Botón para enviar texto */}
          <div className="mb-6">
            <button
              onClick={handleTextSubmit}
              className={`w-full py-3 bg-purple-800 hover:bg-indigo-700 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Procesando texto...' : 'Enviar texto para analizar'}
            </button>
          </div>

          {/* Dropzone para subir archivo */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-400">Sube tu archivo</label>
            <div
              {...getRootProps()}
              className="p-4   rounded-lg cursor-pointer bg-gray-800 text-gray-300 "
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-gray-300">Suelta el archivo aquí...</p>
              ) : (
                <p className="text-gray-300">Arrastra y suelta un archivo aquí, o haz clic para seleccionar uno.</p>
              )}
            </div>
          </div>

          {/* Botón para enviar archivo */}
          <div className="mb-6">
            <button
              onClick={handleFileSubmit}
              className={`w-full py-3 bg-purple-800 hover:bg-indigo-700 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Procesando archivo...' : 'Enviar archivo para analizar'}
            </button>
          </div>

          {/* Respuesta */}
          <div className="mt-6">
            <p className="whitespace-pre-wrap text-gray-400">{response}</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAutomata;
