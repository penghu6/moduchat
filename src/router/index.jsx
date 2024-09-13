import { Route, Routes, Navigate } from "react-router-dom";

// 引入页面

function RouteConfig() {
    return (
        <Routes>
            <Route path="/" element={<Navigate replace to="/" />} />
        </Routes>
    )
}

export default RouteConfig;