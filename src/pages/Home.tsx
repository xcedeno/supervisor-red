import { Link } from 'react-router-dom';

const Home = () => {
return (
<div>
    <h1>Página de Inicio</h1>
    <Link to="/devices">Ver dispositivos</Link>
</div>
);
};

export default Home;