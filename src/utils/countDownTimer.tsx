import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC = () => {
  // Estado inicial para el contador (3 minutos = 180 segundos)
  const [timeLeft, setTimeLeft] = useState<number>(180);

  // Efecto para iniciar el temporizador
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1); // Decrementa el contador cada segundo
      }, 1000);

      return () => clearTimeout(timer); // Limpia el temporizador cuando el componente se desmonta
    } else {
      // Cuando el contador llega a 0, refresca la página
      window.location.reload();
    }
  }, [timeLeft]); // El efecto se ejecuta cada vez que cambia timeLeft

  // Formatear el tiempo restante en minutos y segundos
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div>
      <p>Actualización automática en: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
    </div>
  );
};

export default CountdownTimer;