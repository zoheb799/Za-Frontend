const HeadingType1 = ({ headText = "DashBoard" }) => {
    return <span className="text-2xl font-semibold">{headText}</span>;
};
const HeadingType2 = ({
    headText = "DashBoard",
    childtext = "Sub setting",
}) => {
    const symbol = ">";
    return (
        <span className="text-2xl font-semibold">
            {headText} {symbol}{" "}
            <span className="text-lg text-gray-600">{childtext}</span>
        </span>
    );
};

const GetDashBoardHeader = (props) => {
    /**
     * props:
     * activePath  {type= string}: avtive path taken from the window URL
     */
    const { activePath = "/dshboard" } = props;

    switch (true) {
        case activePath === "/dashboard" || activePath === "/dashboard/":
            return <HeadingType1 headText="Dashboard" />;
        case activePath.startsWith("/dashboard/project"):
            return <HeadingType1 headText="Projects" />;
        case activePath.startsWith("/dashboard/task"):
            return <HeadingType1 headText="Tasks" />;
        case activePath.startsWith("/dashboard/ticket"):
            return <HeadingType1 headText="Tickets" />;
        case activePath.startsWith("/dashboard/message"):
            return <HeadingType1 headText="Messages" />;
        case activePath.startsWith("/dashboard/profile"):
            return <HeadingType1 headText="Profile" />;
        case activePath === "/dashboard/setting" ||
            activePath === "/dashboard/setting/":
            return <HeadingType1 headText="Settings" />;
        case activePath === "/dashboard/setting/company-settings" ||
            activePath === "/dashboard/setting/company-settings/":
            return (
                <HeadingType2
                    headText="Settings"
                    childtext="Company-Settings"
                />
            );
        case activePath === "/dashboard/setting/business-address" ||
            activePath === "/dashboard/setting/business-address/":
            return (
                <HeadingType2
                    headText="Settings"
                    childtext="Business-Settings"
                />
            );
        case activePath === "/dashboard/setting/app-settings" ||
            activePath === "/dashboard/setting/app-settings/":
            return (
                <HeadingType2 headText="Settings" childtext="App-Settings" />
            );
        case activePath === "/dashboard/setting/role-permissions" ||
            activePath === "/dashboard/setting/role-permissions/":
            return (
                <HeadingType2
                    headText="Settings"
                    childtext="Role-Permissions"
                />
            );
        case activePath === "/dashboard/setting/task-settings" ||
            activePath === "/dashboard/setting/task-settings/":
            return (
                <HeadingType2 headText="Settings" childtext="Task-Settings" />
            );
        case activePath === "/dashboard/setting/module-settings" ||
            activePath === "/dashboard/setting/module-settings/":
            return (
                <HeadingType2 headText="Settings" childtext="Module-Settings" />
            );
        case activePath.startsWith("/dashboard/financial-management"):
            return <HeadingType1 headText="Financial Management" />;
        case activePath.startsWith("/dashboard/performance-tracking"):
            return <HeadingType1 headText="Performance Tracking" />;
        case activePath.startsWith("/dashboard/user-management"):
            return <HeadingType1 headText="User Management" />;
        default:
            return <HeadingType1 headText="Dashboard" />;
    }
};
export default GetDashBoardHeader;
