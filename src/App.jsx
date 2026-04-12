import { Route } from "react-router-dom";
import React from "react";
import { Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./Layout";

function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
			</Route>
		</Routes>
	);
}

export default App;