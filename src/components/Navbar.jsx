import { BookA , LogOut, User } from "lucide-react";
import { LuBookMarked } from "react-icons/lu";
import React from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getData } from "@/context/userContext";
import axios from "axios";
import { API } from "../api/api";
import { toast } from "sonner";

const Navbar = () => {
  const { user, setUser } = getData();
  const accessToken = localStorage.getItem("accessToken");
  console.log(user);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        API.LOGOUT,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        setUser(null);
        toast.success(res.data.message);
        localStorage.clear();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* logo section  */}
        <div className="flex gap-2 items-center">
          <LuBookMarked className="h-6 w-6 text-primary" />
          <h1 className="font-accent font-bold text-xl text-gradient">
            RemoteClassRoom
          </h1>
        </div>
        <div className="flex gap-7 items-center">
          <ul className="flex gap-7 items-center text-lg font-primary font-semibold text-muted-foreground">
            <li className="hover:text-primary transition-colors cursor-pointer">
              Features
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              Pricing
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              About
            </li>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BookA />
                    Notes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutHandler}>
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to={"/login"}>
                <li>Login</li>
              </Link>
            )}
          </ul>
          <ul
            className={`gap-7 items-center text-lg font-primary font-semibold hover:cursor-pointer ${
              user ? "hidden" : "flex"
            }`}
          >
            <li>
              <Link to={"/signup"}>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors font-secondary">
                  Sign Up
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
