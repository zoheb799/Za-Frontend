import React, { useRef, useEffect } from "react";
import Homepage from "../pages/Homepage.jsx";
import Products from "../pages/Products.jsx";
import Navbar from "./Navbar.jsx";

const Home = () => {
    const sectionRefs = useRef({
        home: null,
        Offers: null,
        Products: null,
    });

    useEffect(() => {
        sectionRefs.current.home = document.getElementById("home");
        sectionRefs.current.about = document.getElementById("offers");
        sectionRefs.current.services = document.getElementById("products");
    }, []);

    return (
        <div className=" relative z-0 ">
<div className="pt-24">
            <Navbar sectionRefs={sectionRefs} />
            <div
                id="home"
                ref={(el) => (sectionRefs.current.home = el)}
            >
                <Homepage />
            </div>
           
            <div id="products" ref={(el) => (sectionRefs.current.Products = el)}>
                <Products />
            </div>
        </div>
        </div>
        
    );
};

export default Home;
