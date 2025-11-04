import React, { ReactNode, useEffect, useState } from "react";
import { AuthContext, DEFAULT_USER } from "./contexts";
import { getUserById } from "@/api";

export type TUser = {
    username: string;
    id: string;
    image: string;
    alias: string;
    daysUntilListExpires: string;
    daysUntilEntryExpires: string;
    theme: string;
};

export type DBUser = {
    id: string;
    username: string;
    password: string;
    image: string;
    alias: string;
    daysUntilListExpires: string;
    daysUntilEntryExpires: string;
    theme: string;
};

export type TAuthContext = {
    user: DBUser;
    setUser: React.Dispatch<React.SetStateAction<DBUser>>;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<DBUser>(DEFAULT_USER);

    const fetchUserFromStorage = async (id: string) => {
        const user = await getUserById(id);
        setUser(user);
    };

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            fetchUserFromStorage(JSON.parse(user).user);
            //setUser based on a user id, but make sure it's pulled from the db
            // console.log(JSON.parse(user).user);
            // setUser(JSON.parse(user));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
