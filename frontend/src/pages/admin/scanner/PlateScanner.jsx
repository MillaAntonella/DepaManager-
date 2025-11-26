// ...existing code...
import React, { useRef, useState, useEffect } from 'react';
import { adminAPI } from '../../../services/api/admin';

export default function PlateScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [detectionPreview, setDetectionPreview] = useState(null);
  const [savedResult, setSavedResult] = useState(null);
  const [editablePlate, setEditablePlate] = useState('');

  useEffect(() => {
    let mounted = true;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: 1280, height: 720 },
          audio: false,
        });

        if (!mounted) {
          if (stream && stream.getTracks) stream.getTracks().forEach(t => t.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try { await videoRef.current.play(); } catch (e) {}
          setIsScanning(true);
        }
      } catch (err) {
        console.error('Camera error:', err);
        setError('No se pudo acceder a la cámara: ' + (err?.message || err));
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const vw = video.videoWidth || 1280;
    const vh = video.videoHeight || 720;

    canvas.width = vw;
    canvas.height = vh;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      await processImage(blob);
    }, 'image/jpeg', 0.9);
  };

  const processImage = async (blob) => {
    setIsProcessing(true);
    setError('');
    setDetectionPreview(null);

    try {
      const form = new FormData();
      form.append('image', blob, 'capture.jpg');

      const response = await adminAPI.previewFromWebcam(form);
      
      if (response.data && response.data.success) {
        const detection = response.data.data;
        setDetectionPreview(detection);
        setEditablePlate(detection.plate_text || '');
      } else {
        setError('No se pudo detectar la placa en la imagen');
      }
    } catch (err) {
      console.error('Processing error:', err);
      setError('Error al procesar la imagen: ' + (err.response?.data?.message || err?.message || err));
    } finally {
      setIsProcessing(false);
    }
  };

  const saveDetection = async () => {
    if (!detectionPreview) return;

    setIsSaving(true);
    setError('');

    try {
      const response = await adminAPI.saveFromWebcam({
        plate_text: editablePlate.toUpperCase(),
        confidence: detectionPreview.confidence,
        device_ip: detectionPreview.device_ip,
        pattern: detectionPreview.pattern,
        engine: detectionPreview.engine,
        notes: detectionPreview.notes
      });

      if (response.data && response.data.success) {
        setSavedResult(response.data.data);
        setDetectionPreview(null);
        setEditablePlate('');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Error al guardar: ' + (err.response?.data?.message || err?.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  const clearCapture = () => {
    setCapturedImage(null);
    setDetectionPreview(null);
    setSavedResult(null);
    setEditablePlate('');
    setError('');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📷 Plate Scanner (Webcam)</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-4 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-gray-100 rounded overflow-hidden border">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto bg-black"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={captureImage}
            disabled={!isScanning || isProcessing}
            className={`px-5 py-2 rounded text-white transition ${isScanning && !isProcessing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            {isProcessing ? '⏳ Procesando...' : '📸 Capturar'}
          </button>

          <button
            onClick={clearCapture}
            disabled={!capturedImage && !detectionPreview && !savedResult}
            className={`px-4 py-2 rounded border ${capturedImage || detectionPreview || savedResult ? 'bg-white hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'}`}
          >
            🗑 Limpiar
          </button>
        </div>
      </div>

      {capturedImage && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Imagen Capturada</h2>
          <div className="border rounded overflow-hidden max-w-md mx-auto">
            <img src={capturedImage} alt="Captured plate" className="w-full h-auto" />
          </div>
        </div>
      )}

      {detectionPreview && (
        <div className="mt-6 max-w-2xl mx-auto p-6 border-2 border-blue-500 rounded-lg bg-blue-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-blue-900">Detección Encontrada</h3>
            <span className="text-sm text-blue-600">ID: {detectionPreview.id}</span>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Placa Detectado
            </label>
            <input
              type="text"
              value={editablePlate}
              onChange={(e) => setEditablePlate(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono tracking-wider"
              placeholder="ABC-123"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Puedes editar el número de placa si es necesario
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Confianza</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${detectionPreview.confidence >= 80 ? 'bg-green-500' : detectionPreview.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${detectionPreview.confidence}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold">{detectionPreview.confidence}%</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">IP Dispositivo</p>
              <p className="text-sm font-mono text-gray-900">{detectionPreview.device_ip || '-'}</p>
            </div>
          </div>

          {detectionPreview.notes && (
            <div className="bg-white rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-500 mb-1">Notas</p>
              <p className="text-sm text-gray-700">{detectionPreview.notes}</p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ ¿Estás seguro de registrar esta detección?
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Verifica que el número de placa sea correcto antes de guardar.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={clearCapture}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              ❌ Cancelar
            </button>
            <button
              onClick={saveDetection}
              disabled={isSaving || !editablePlate.trim()}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '⏳ Guardando...' : '✅ Confirmar y Guardar'}
            </button>
          </div>
        </div>
      )}

      {savedResult && (
        <div className="mt-6 max-w-2xl mx-auto p-6 border-2 border-green-500 rounded-lg bg-green-50">
          <div className="text-center mb-4">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-green-900 mb-2">¡Detección Guardada!</h3>
            <p className="text-sm text-green-700">La placa ha sido registrada exitosamente en el sistema</p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="text-center mb-3">
              <p className="text-xs text-gray-500 mb-2">Placa Registrada</p>
              <p className="text-3xl font-bold text-green-700 tracking-wider font-mono">
                {savedResult.plate_text}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center">
                <p className="text-xs text-gray-500">Confianza</p>
                <p className="font-bold text-gray-900">{savedResult.confidence}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">IP Dispositivo</p>
                <p className="font-mono text-gray-900 text-xs">{savedResult.device_ip || '-'}</p>
              </div>
            </div>
          </div>

          <button
            onClick={clearCapture}
            className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            🔄 Escanear Nueva Placa
          </button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
