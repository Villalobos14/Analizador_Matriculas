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
    <div className="flex h-screen bg-[url('/rose.jpeg')] bg-cover bg-center text-gray-300">
      
      {/* Sección izquierda con títulos descriptivos */}
      <div className="w-1/2 flex flex-col justify-center items-start px-12 ">
        <h1 className="text-5xl font-semibold mb-6 leading-tight text-gray-100">Explora el poder del análisis automático</h1>
        <p className="text-lg font-light mb-8 text-gray-400">
          Subir cadenas de texto o archivos nunca ha sido tan fácil. Descubre patrones y analiza de manera eficiente.
        </p>
      </div>

      {/* Formulario minimalista con transparencia */}
      <div className="w-1/2 flex items-center justify-center">
        <form 
          onSubmit={handleSubmit} 
          className="w-full max-w-md p-8 rounded-lg bg-black/70 backdrop-blur-lg"
        >
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
              required
            />
          </div>

          {/* Input para subir archivo */}
          <div className="mb-6">
            <label htmlFor="file" className="block text-sm font-medium mb-2 text-gray-400">Sube tu archivo</label>
            <input
              type="file"
              id="file"
              accept=".pdf, .txt, .doc"
              onChange={handleFileChange}
              className="w-full p-3 rounded-lg bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Botón de enviar */}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className={`w-full py-3 bg-purple-800 hover:bg-indigo-700 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Enviar para analizar'}
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
