import React from "react";
import ArrowIcon from "../assets/svgs/arrow";
import LOGOFOO from "../assets/svgs/logoFooter";
import CodeIcon from "../assets/svgs/code";
import ProfileIcon from "../assets/svgs/profile";
import KORIcon from "../assets/svgs/kor";
import SettingIcon from "../assets/svgs/setting";

const services = [
    {
        label: "E-commerce Development",
        icon: <CodeIcon />,
        link: "#",
    },
    {
        label: "Product Management",
        icon: <ProfileIcon />,
        link: "#",
    },
    {
        label: "Logistics Integration",
        icon: <KORIcon />,
        link: "#",
    },
    {
        label: "Payment Gateway Setup",
        icon: <SettingIcon />,
        link: "#",
    },
];

const Footer = () => {
    return (
        <footer className="bg-[#f8f9fa] py-12 px-6 text-gray-800">
            <div className="max-w-7xl mx-auto space-y-10 p-5">
                {/* Top Section */}
                <div className="flex flex-col lg:flex-row lg:justify-between gap-8 items-start">
                    {/* Logo & Contact */}
                    <div className="flex flex-col items-start text-start max-w-sm">
                        <LOGOFOO />
                        <p className="mt-3 text-sm text-[#343741] font-medium">
                            India's trusted marketplace for modern e-commerce solutions.
                        </p>
                        <div className="mt-4 text-sm font-medium text-[#5E626F] space-y-1">
                            <p>📞 +91 98765 43210</p>
                            <p>✉️ support@ecommerce.in</p>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-300"
                            >
                                <div className="text-2xl text-blue-600">{service.icon}</div>
                                <p className="mt-2 font-semibold text-sm text-[#343741]">
                                    {service.label}
                                </p>
                                <a
                                    href={service.link}
                                    className="font-medium text-xs text-blue-600 flex items-center mt-2 gap-1"
                                >
                                    Explore <ArrowIcon />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm text-[#5E626F] font-medium">
                    <div>
                        <p className="text-[#343741] font-semibold mb-2">Customer Support</p>
                        <p>Help Center</p>
                        <p>Returns & Refunds</p>
                        <p>Shipping Policy</p>
                        <p>FAQs</p>
                    </div>

                    <div>
                        <p className="text-[#343741] font-semibold mb-2">Company</p>
                        <p>About Us</p>
                        <p>Careers</p>
                        <p>Terms & Conditions</p>
                        <p>Privacy Policy</p>
                    </div>

                    <div>
                        <p className="text-[#343741] font-semibold mb-2">Sellers</p>
                        <p>Become a Seller</p>
                        <p>Seller Guidelines</p>
                        <p>Seller Support</p>
                    </div>

                    <div>
                        <p className="text-[#343741] font-semibold mb-2">Connect With Us</p>
                        <p>Facebook</p>
                        <p>Instagram</p>
                        <p>LinkedIn</p>
                        <p>Twitter</p>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="border-t border-gray-300 pt-4 text-sm text-gray-500 flex flex-col md:flex-row justify-between">
                    <p>© {new Date().getFullYear()} E-Commerce India Pvt. Ltd. All rights reserved.</p>
                    <p>Registered Address: 123, Main Road, New Delhi, 110053, India</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
