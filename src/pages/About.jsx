import React from "react";
import { NavLink } from "react-router-dom";

export default function About() {
	return (

		<div>

			<div>About</div>

			<button><NavLink className={"hover:text-red-400"} to={"/login"}>log out (test)</NavLink></button>

		</div>


	)

		
}
