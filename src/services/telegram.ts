import axios from 'axios';


const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export const sendTelegramMessage = async (message: string) => {
const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
try {
await axios.post(url, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
});
} catch (error) {
console.error('Error al enviar mensaje a Telegram:', error);
}
};