import { Route, Routes } from "react-router-dom";
import Home from "../pages/home";

function RouteConfig() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    )
}

export default RouteConfig;