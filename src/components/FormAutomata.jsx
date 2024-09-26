import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const FormAutomata = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);  // Estado para la URL del archivo descargable

  // Manejar archivos con Dropzone, aceptando archivos de varios tipos
  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles[0]);
    console.log(acceptedFiles[0]);  // Verifica el archivo cargado en consola
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'text/html': ['.html'],
      'application/msword': ['.doc', '.docx'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    }
  });

  // Enviar el archivo al servidor
  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setResponse("No se ha seleccionado ningún archivo.");
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);  // Añadir el archivo al formData

    try {
      // Enviar el archivo al backend usando axios
      const { data } = await axios.post('http://34.232.157.163/api/validate_plate/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },  // Correcto encabezado para formData
        responseType: 'blob'  // Para manejar archivos de respuesta
      });

      // Crear una URL temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([data]));
      setDownloadUrl(url);
      setResponse('Archivo analizado y listo para descargar.');
    } catch (error) {
      console.error('Error al enviar el archivo:', error.response?.data || error.message);
      setResponse('Error al analizar el archivo.');
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
          
          {/* Dropzone para subir archivo */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-400">Sube tu archivo</label>
            <div
              {...getRootProps()}
              className="p-4 rounded-lg cursor-pointer bg-gray-800 text-gray-300"
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
              className={`w-full py-3 bg-purple-800 hover:bg-purple-800 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Procesando archivo...' : 'Enviar archivo para analizar'}
            </button>
          </div>

          {/* Respuesta */}
          <div className="mt-6 w-full">
            <p className="whitespace-pre-wrap text-gray-400">{response}</p>
          </div>

          {/* Botón de descarga si hay un archivo disponible */}
          {downloadUrl && (
            <div className="mt-6 w-full">
              <div className='flex justify-center text-center'>

              <a
                href={downloadUrl}
                download="resultado.csv"
                className="w-full py-3 p-10 bg-orange-600 hover:bg-indigo-700  text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Descargar archivo analizado
              </a>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormAutomata;
