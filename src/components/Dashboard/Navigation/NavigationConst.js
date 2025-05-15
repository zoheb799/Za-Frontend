export const GetNavigationData = () => {
    return [
        { label: "Home", path: "/", icon: "pi pi-home" },

        {
            label: "Dashboard",
            path: "/dashboard",
            icon: "pi pi-warehouse",
        },
        {
            label: "Products",
            path: "/dashboard/product",
            icon: "pi pi-pen-to-square",
        },
        {
            label: "Orders",
            path: "/dashboard/orders",
            icon: "pi pi-ticket",
        },
        {
            label: "Messages",
            path: "/dashboard/message",
            icon: "pi pi-inbox",
        },
        {
            label: "Profile",
            path: "/dashboard/profile",
            icon: "pi pi-user",
        },
    ];
};
