/**
 * Punto de entrada principal de la aplicación
 * Inicia el servidor web y el bot de WhatsApp
 */

// Polyfill para crypto (soluciona error en algunos entornos de despliegue)
import { webcrypto } from 'crypto';
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

import { conectarBot } from './src/bot.js';
import { iniciarServidor } from './server.js';

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando Bottom Chatbot...\n');

  try {
    // Iniciar servidor web para mostrar QR
    console.log('📡 Iniciando servidor web...');
    iniciarServidor();
    console.log('✅ Servidor web iniciado\n');

    // Esperar un segundo para que el servidor esté listo
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Conectar bot de WhatsApp
    console.log('🤖 Conectando bot de WhatsApp...');
    await conectarBot();
    console.log('✅ Bot conectado\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Bottom Chatbot está funcionando correctamente');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📱 Para conectar WhatsApp, accede a:');
    
    if (process.env.RAILWAY_STATIC_URL) {
      console.log(`   https://${process.env.RAILWAY_STATIC_URL}`);
      console.log(`   (Railway - Producción)\n`);
    } else {
      console.log(`   http://localhost:${process.env.PORT || 8080}\n`);
    }
    
    console.log('⚠️  Mantén esta ventana abierta mientras el bot esté en uso');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error fatal al iniciar la aplicación:', error);
    process.exit(1);
  }
}

/**
 * Manejo de errores no capturados
 */
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Promesa rechazada no manejada:', error);
});

/**
 * Manejo de cierre de aplicación
 */
process.on('SIGINT', () => {
  console.log('\n\n👋 Cerrando Bottom Chatbot...');
  console.log('✅ Aplicación cerrada correctamente');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Cerrando Bottom Chatbot...');
  console.log('✅ Aplicación cerrada correctamente');
  process.exit(0);
});

// Iniciar la aplicación
main();

