import React, { useState } from 'react';

export default function PaymentGatewayModal({ pago, onClose, onPaymentComplete }) {
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [comprobante, setComprobante] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [procesando, setProcesando] = useState(false);

  // Métodos de pago disponibles
  const metodosPago = [
    {
      id: 1,
      tipo: 'Yape',
      nombre: 'Yape',
      icon: '💜',
      color: 'from-purple-500 to-purple-600',
      qr_imagen: '/assets/yape-qr.png',
      numero_celular: '987 654 321',
      nombre_titular: 'Juan Pérez Admin'
    },
    {
      id: 2,
      tipo: 'Plin',
      nombre: 'Plin',
      icon: '💙',
      color: 'from-blue-500 to-blue-600',
      qr_imagen: '/assets/plin-qr.png',
      numero_celular: '987 654 321',
      nombre_titular: 'Juan Pérez Admin'
    },
    {
      id: 3,
      tipo: 'Transferencia',
      nombre: 'Transferencia Bancaria',
      icon: '🏦',
      color: 'from-green-500 to-green-600',
      banco: 'BCP',
      tipo_cuenta: 'Ahorros',
      numero_cuenta: '191-12345678-0-99',
      cci: '00219100123456780099',
      nombre_titular: 'Juan Pérez Administrador'
    },
    {
      id: 4,
      tipo: 'PayPal',
      nombre: 'PayPal / Tarjeta',
      icon: '💳',
      color: 'from-blue-600 to-indigo-600'
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo es muy grande. Máximo 10MB');
        return;
      }

      setComprobante(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadReceipt = () => {
    if (!comprobante) {
      alert('❌ Por favor selecciona un comprobante');
      return;
    }

    setLoading(true);
    setProcesando(true);

    // Simular subida de archivo
    setTimeout(() => {
      setLoading(false);
      
      // Simular procesamiento
      setTimeout(() => {
        setProcesando(false);
        // Llamar al callback con el método de pago
        onPaymentComplete(metodoSeleccionado.tipo, previewUrl);
      }, 1500);
    }, 2000);
  };

  const handlePayPalPay = () => {
    setLoading(true);
    setProcesando(true);

    // Simular proceso de pago con PayPal
    setTimeout(() => {
      setLoading(false);
      
      // Simular confirmación
      setTimeout(() => {
        setProcesando(false);
        onPaymentComplete('PayPal');
      }, 1500);
    }, 2500);
  };

  const renderMetodoYape = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
        <div className="bg-white inline-block p-4 rounded-2xl shadow-lg mb-4">
          <img 
            src={metodoSeleccionado.qr_imagen}
            alt="QR Yape" 
            className="w-64 h-64 object-contain"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/256x256/9333EA/ffffff?text=QR+YAPE';
            }}
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-purple-700">
            <span>1️⃣</span>
            <span>Abre tu app Yape</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-purple-700">
            <span>2️⃣</span>
            <span>Escanea el código QR</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-purple-700">
            <span>3️⃣</span>
            <span>Confirma el pago</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 mt-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Monto a pagar</p>
          <p className="text-4xl font-bold text-purple-600 mb-4">S/ {pago.monto.toFixed(2)}</p>
          
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-xs text-gray-500">📱 Número</p>
              <p className="text-sm font-semibold text-gray-900">{metodoSeleccionado.numero_celular}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">👤 Nombre</p>
              <p className="text-sm font-semibold text-gray-900">{metodoSeleccionado.nombre_titular}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-dashed border-purple-200 pt-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-xl mr-2">📸</span>
          Sube tu comprobante de pago
        </h4>
        
        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          previewUrl ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/30'
        }`}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload-yape"
            disabled={loading}
          />
          <label htmlFor="file-upload-yape" className="cursor-pointer">
            {previewUrl ? (
              <div className="space-y-3">
                <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-md" />
                <p className="text-sm text-purple-600 font-medium">✓ Comprobante cargado</p>
                <p className="text-xs text-gray-500">Click para cambiar imagen</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-6xl">📸</div>
                <div>
                  <p className="text-gray-700 font-medium">Click para subir comprobante</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG hasta 10MB</p>
                </div>
              </div>
            )}
          </label>
        </div>

        <button
          onClick={handleUploadReceipt}
          disabled={loading || !comprobante}
          className="w-full mt-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Subiendo comprobante...</span>
            </>
          ) : (
            <>
              <span>✅</span>
              <span>Confirmar Pago</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderMetodoPlin = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
        <div className="bg-white inline-block p-4 rounded-2xl shadow-lg mb-4">
          <img 
            src={metodoSeleccionado.qr_imagen}
            alt="QR Plin" 
            className="w-64 h-64 object-contain"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/256x256/3B82F6/ffffff?text=QR+PLIN';
            }}
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
            <span>1️⃣</span>
            <span>Abre tu app Plin</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
            <span>2️⃣</span>
            <span>Escanea el código QR</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
            <span>3️⃣</span>
            <span>Confirma el pago</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 mt-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Monto a pagar</p>
          <p className="text-4xl font-bold text-blue-600 mb-4">S/ {pago.monto.toFixed(2)}</p>
          
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-xs text-gray-500">📱 Número</p>
              <p className="text-sm font-semibold text-gray-900">{metodoSeleccionado.numero_celular}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">👤 Nombre</p>
              <p className="text-sm font-semibold text-gray-900">{metodoSeleccionado.nombre_titular}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-dashed border-blue-200 pt-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-xl mr-2">📸</span>
          Sube tu comprobante de pago
        </h4>
        
        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          previewUrl ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
        }`}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload-plin"
            disabled={loading}
          />
          <label htmlFor="file-upload-plin" className="cursor-pointer">
            {previewUrl ? (
              <div className="space-y-3">
                <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-md" />
                <p className="text-sm text-blue-600 font-medium">✓ Comprobante cargado</p>
                <p className="text-xs text-gray-500">Click para cambiar imagen</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-6xl">📸</div>
                <div>
                  <p className="text-gray-700 font-medium">Click para subir comprobante</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG hasta 10MB</p>
                </div>
              </div>
            )}
          </label>
        </div>

        <button
          onClick={handleUploadReceipt}
          disabled={loading || !comprobante}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Subiendo comprobante...</span>
            </>
          ) : (
            <>
              <span>✅</span>
              <span>Confirmar Pago</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderMetodoTransferencia = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-6 text-center text-lg flex items-center justify-center">
          <span className="text-2xl mr-2">🏦</span>
          Datos Bancarios para Transferencia
        </h4>
        
        <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-xs text-gray-500 mb-1">Banco</p>
              <p className="font-semibold text-gray-900 text-lg">{metodoSeleccionado.banco}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-xs text-gray-500 mb-1">Tipo de Cuenta</p>
              <p className="font-semibold text-gray-900 text-lg">{metodoSeleccionado.tipo_cuenta}</p>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-xs text-gray-500 mb-1">Número de Cuenta</p>
            <p className="font-mono font-bold text-gray-900 text-xl">{metodoSeleccionado.numero_cuenta}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-xs text-gray-500 mb-1">CCI (Código de Cuenta Interbancaria)</p>
            <p className="font-mono font-bold text-gray-900 text-lg">{metodoSeleccionado.cci}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-xs text-gray-500 mb-1">Titular de la Cuenta</p>
            <p className="font-semibold text-gray-900 text-lg">{metodoSeleccionado.nombre_titular}</p>
          </div>
        </div>

        <div className="text-center py-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mt-6 shadow-lg">
          <p className="text-sm text-green-50 mb-2">Monto Total a Transferir</p>
          <p className="text-5xl font-bold text-white">S/ {pago.monto.toFixed(2)}</p>
        </div>
      </div>

      <div className="border-t-2 border-dashed border-green-200 pt-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-xl mr-2">📄</span>
          Sube tu comprobante de transferencia
        </h4>
        
        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          previewUrl ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50/30'
        }`}>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload-transfer"
            disabled={loading}
          />
          <label htmlFor="file-upload-transfer" className="cursor-pointer">
            {previewUrl ? (
              <div className="space-y-3">
                <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-md" />
                <p className="text-sm text-green-600 font-medium">✓ Comprobante cargado</p>
                <p className="text-xs text-gray-500">Click para cambiar archivo</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-6xl">📄</div>
                <div>
                  <p className="text-gray-700 font-medium">Click para subir comprobante</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, PDF hasta 10MB</p>
                </div>
              </div>
            )}
          </label>
        </div>

        <button
          onClick={handleUploadReceipt}
          disabled={loading || !comprobante}
          className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Subiendo comprobante...</span>
            </>
          ) : (
            <>
              <span>✅</span>
              <span>Confirmar Pago</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderMetodoPayPal = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white text-center shadow-2xl">
        <div className="text-7xl mb-6 animate-bounce">💳</div>
        <h3 className="text-3xl font-bold mb-3">Pago Seguro con PayPal</h3>
        <p className="text-blue-100 mb-8 text-lg">Acepta tarjetas de crédito, débito y saldo PayPal</p>
        
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 mb-8">
          <p className="text-sm text-blue-100 mb-3">Monto a pagar</p>
          <p className="text-5xl font-bold mb-2">$ {(pago.monto / 3.8).toFixed(2)} USD</p>
          <p className="text-sm text-blue-200">≈ S/ {pago.monto.toFixed(2)} PEN</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-xs">Pago 100% Seguro</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-xs">Procesamiento Instantáneo</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">✓</div>
            <p className="text-xs">Confirmación Automática</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-left bg-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <span className="text-lg">✓</span>
            <span>Protección del comprador PayPal</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg">✓</span>
            <span>Encriptación SSL de 256 bits</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg">✓</span>
            <span>No compartas datos bancarios</span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayPalPay}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-bold text-xl transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center space-x-3"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span>Procesando pago seguro...</span>
          </>
        ) : (
          <>
            <span>🔒</span>
            <span>Pagar con PayPal</span>
          </>
        )}
      </button>

      <div className="text-center bg-gray-50 rounded-lg p-4">
        <p className="text-xs text-gray-600 leading-relaxed">
          Al hacer clic en "Pagar con PayPal", aceptas los términos y condiciones. 
          Serás redirigido a PayPal para completar tu pago de forma segura.
          <br />
          <span className="font-semibold mt-2 inline-block">🔐 Tu información está protegida</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1 flex items-center">
                <span className="text-3xl mr-3">💰</span>
                Realizar Pago
              </h2>
              <p className="text-teal-100">{pago.concepto} - {pago.descripcion_servicio}</p>
              <p className="text-white font-bold text-xl mt-2">Monto: S/ {pago.monto.toFixed(2)}</p>
            </div>
            <button
              onClick={onClose}
              disabled={loading || procesando}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {procesando ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mb-6"></div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Procesando tu pago...</h3>
                <p className="text-gray-600">Por favor espera un momento</p>
              </div>
            ) : !metodoSeleccionado ? (
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">Selecciona tu método de pago</h3>
                <p className="text-gray-600 text-center mb-8">Elige la forma más cómoda para ti</p>
                <div className="grid grid-cols-2 gap-6">
                  {metodosPago.map((metodo) => (
                    <button
                      key={metodo.id}
                      onClick={() => setMetodoSeleccionado(metodo)}
                      className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all p-8 text-center transform hover:scale-105"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${metodo.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      <div className="relative z-10">
                        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                          {metodo.icon}
                        </div>
                        <p className="font-bold text-lg text-gray-900 group-hover:text-white transition-colors">
                          {metodo.nombre}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => {
                    setMetodoSeleccionado(null);
                    setComprobante(null);
                    setPreviewUrl(null);
                  }}
                  disabled={loading}
                  className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="font-medium">Cambiar método de pago</span>
                </button>

                {metodoSeleccionado.tipo === 'Yape' && renderMetodoYape()}
                {metodoSeleccionado.tipo === 'Plin' && renderMetodoPlin()}
                {metodoSeleccionado.tipo === 'Transferencia' && renderMetodoTransferencia()}
                {metodoSeleccionado.tipo === 'PayPal' && renderMetodoPayPal()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}