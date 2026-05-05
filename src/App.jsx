import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// Componentes de páginas
import Dashboard from './pages/Dashboard';
import BookSpace from './pages/BookSpace';
import Facilities from './pages/Facilities';
import Reports from './pages/Reports';
import LostItems from './pages/LostItems';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="facilities" element={<Facilities />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />

                    <Route element={<PrivateRoute />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="reservations/new" element={<BookSpace />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="lost-items" element={<LostItems />} />
                    </Route>

                    {/* Rutas de Admin */}
                    <Route element={<PrivateRoute roles={['admin']} />}>
                        {/* <Route path="admin/spaces" element={<AdminSpaces />} /> */}
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
