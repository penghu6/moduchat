import { Route, Routes, Navigate } from "react-router-dom";

// 引入页面
import Issues from '../pages/Issues';

function RouteConfig() {
    return (
        <Routes>
            <Route path="/" element={<Navigate replace to="/issues" />} />
        </Routes>
    )
}

export default RouteConfig;