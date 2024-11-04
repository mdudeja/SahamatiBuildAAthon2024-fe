import { Router, Route } from "preact-iso"
import { About } from "../pages/About"
import { Contact } from "../pages/Contact"
import { Login } from "../pages/Login"
import { Register } from "../pages/Register"
import { Home } from "../pages/Home"
import { AddOffering } from "../pages/AddOffering"

export const routes = {
  "/": {
    path: "/",
    component: Home,
    showInNav: false,
    protected: true,
  },
  "/about": {
    path: "/about",
    component: About,
    showInNav: true,
    protected: true,
  },
  "/contact": {
    path: "/contact",
    component: Contact,
    showInNav: true,
    protected: true,
  },
  "/login": {
    path: "/login",
    component: Login,
    showInNav: true,
    protected: false,
  },
  "/register": {
    path: "/register",
    component: Register,
    showInNav: false,
    protected: false,
  },
  "/addoffering": {
    path: "/addoffering",
    component: AddOffering,
    showInNav: false,
    protected: true,
  },
}
