import { Route } from "react-router-dom";
import React from "react";
import { Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./Layout";
import LoginPage from "./pages/LoginPage";

function App() {
	return (
		<Routes>

			<Route element={<LoginPage />} path="/login">
			</Route>

			<Route element={<Layout />}>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
			</Route>
		</Routes>
	);
}

export default App;