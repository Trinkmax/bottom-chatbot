/**
 * Servidor web para mostrar el código QR
 * Permite al cliente escanear el QR desde una página web
 */

import express from 'express';
import qrcode from 'qrcode';
import { SETTINGS } from './config/settings.js';

const app = express();
let qrCodeData = null;
let connectionStatus = 'Esperando conexión...';

/**
 * Actualiza el código QR
 */
export function actualizarQR(qr) {
  qrCodeData = qr;
  connectionStatus = 'Escanea el código QR con WhatsApp';
}

/**
 * Actualiza el estado de la conexión
 */
export function actualizarEstadoConexion(estado) {
  connectionStatus = estado;
}

/**
 * Página principal con el QR
 */
app.get('/', async (req, res) => {
  try {
    let qrImage = '';
    
    if (qrCodeData) {
      // Generar imagen QR en formato data URL
      qrImage = await qrcode.toDataURL(qrCodeData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    }

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bottom Bot - Conexión WhatsApp</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            text-align: center;
        }

        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }

        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 16px;
        }

        .qr-container {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 20px;
            min-height: 350px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .qr-image {
            max-width: 300px;
            width: 100%;
            height: auto;
            border-radius: 10px;
            background: white;
            padding: 10px;
        }

        .status {
            color: #555;
            font-size: 18px;
            font-weight: 500;
            margin-top: 20px;
            padding: 15px;
            background: #e3f2fd;
            border-radius: 10px;
            border-left: 4px solid #2196f3;
        }

        .status.connected {
            background: #e8f5e9;
            border-left-color: #4caf50;
            color: #2e7d32;
        }

        .status.waiting {
            background: #fff3e0;
            border-left-color: #ff9800;
            color: #e65100;
        }

        .instructions {
            text-align: left;
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }

        .instructions h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 18px;
        }

        .instructions ol {
            margin-left: 20px;
            color: #555;
        }

        .instructions li {
            margin-bottom: 10px;
            line-height: 1.6;
        }

        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .refresh-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
            transition: background 0.3s;
        }

        .refresh-btn:hover {
            background: #764ba2;
        }

        @media (max-width: 600px) {
            .container {
                padding: 25px;
            }

            h1 {
                font-size: 24px;
            }

            .qr-container {
                padding: 20px;
            }
        }
    </style>
    <script>
        // Auto-refresh cada 3 segundos para actualizar el estado
        setTimeout(() => {
            location.reload();
        }, 3000);
    </script>
</head>
<body>
    <div class="container">
        <h1>🤖 Bottom Bot</h1>
        <p class="subtitle">Bot de WhatsApp para Bottom Resto Bar</p>
        
        <div class="qr-container">
            ${qrImage ? `
                <img src="${qrImage}" alt="Código QR" class="qr-image">
            ` : `
                <div class="spinner"></div>
                <p style="margin-top: 20px; color: #666;">Generando código QR...</p>
            `}
        </div>

        <div class="status ${connectionStatus.includes('conectado') ? 'connected' : 'waiting'}">
            ${connectionStatus}
        </div>

        <div class="instructions">
            <h3>📱 ¿Cómo conectar?</h3>
            <ol>
                <li>Abre WhatsApp en tu teléfono</li>
                <li>Ve a <strong>Configuración</strong> o <strong>Ajustes</strong></li>
                <li>Toca en <strong>Dispositivos vinculados</strong></li>
                <li>Selecciona <strong>Vincular un dispositivo</strong></li>
                <li>Escanea el código QR mostrado arriba</li>
            </ol>
        </div>

        <button class="refresh-btn" onclick="location.reload()">
            🔄 Actualizar
        </button>
    </div>
</body>
</html>
    `;

    res.send(html);
  } catch (error) {
    console.error('Error al generar página QR:', error);
    res.status(500).send('Error al generar el código QR');
  }
});

/**
 * Endpoint de salud
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    connection: connectionStatus,
    timestamp: new Date().toISOString()
  });
});

/**
 * Inicia el servidor
 */
export function iniciarServidor() {
  const PORT = SETTINGS.PORT;
  
  app.listen(PORT, () => {
    console.log(`🌐 Servidor web iniciado en http://localhost:${PORT}`);
    console.log(`📱 Accede para ver el código QR y conectar WhatsApp`);
  });
}

export default {
  iniciarServidor,
  actualizarQR,
  actualizarEstadoConexion
};

