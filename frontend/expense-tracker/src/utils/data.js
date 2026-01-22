import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
    LuUser,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard"
    },
    {
        id: "02",
        label: "Income",
        icon: LuWalletMinimal,
        path: "/income"
    },
    {
        id: "03",
        label: "Expense",
        icon: LuHandCoins,
        path: "/expense"
    },
    {
        id: "04",
        label: "My Account",
        icon: LuUser,
        path: "/my-account"
    },
    {
        id: "05",
        label: "Logout",
        icon: LuLogOut,
        path: "/logout"
    }
]