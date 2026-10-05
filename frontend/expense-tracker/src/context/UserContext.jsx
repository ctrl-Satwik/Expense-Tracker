import React, { createContext, useCallback, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Function to update user data
    // Memoized so effects that depend on it (useUserAuth) don't re-run on every user change
    const updateUser = useCallback((userData) => {
        setUser(userData);
    }, []);

    // Function to clear user data on logout
    const clearUser = useCallback(() => {
        setUser(null);
    }, []);

    return (
        <UserContext.Provider
            value= {{
                user,
                updateUser,
                clearUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;