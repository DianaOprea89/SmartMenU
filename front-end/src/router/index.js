import { createRouter, createWebHistory } from "vue-router";
import MenuPage from "@/views/Menu";
import StartersMenu from "@/components/StartersMenu";
import MainCoursesMenu from "@/components/MainCoursesMenu";
import DessertsMenu from "@/components/DessertsMenu";
import NotFoundPage from "@/views/NotFound";
import LoginPage from "@/views/Login";
import RegisterPage from "@/views/Register";
import ChickenMeat from "@/components/ChickenMeat";
import FishMeat from "@/components/FishMeat";
import PorkMeat from "@/components/PorkMeat";
import CowsMeat from "@/components/CowsMeat";
import DrinksAndBar from "@/components/DrinksAndBar";
import CallComponent from "@/views/Call";
import AboutUs from "@/views/AboutUs";
import Checkout from "@/views/Checkout";
import RecoverPassword from "@/components/RecoverPassword";

const routes = [
    {
        path: '/',
        redirect: '/menu',
    },
    {
        path:'/recover',
        name:'RecoverPassword',
        component: RecoverPassword
    },
    {
        path: '/menu',
        name: 'MenuPage',
        component: MenuPage
    },
    {
        path: '/starter',
        name: 'StartersMenu',
        component: StartersMenu,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/checkout',
        name: 'CheckOut',
        component: Checkout,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/call',
        name: 'CallComponent',
        component: CallComponent,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/main-course',
        name: 'MainCourse',
        component: MainCoursesMenu,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/desserts',
        name: 'DessertsMenu',
        component: DessertsMenu,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/chickenmeat',
        name: 'ChickenMeat',
        component: ChickenMeat,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/fishmeat',
        name: 'FishMeat',
        component: FishMeat,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/porkmeat',
        name: 'PorkMeat',
        component: PorkMeat,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/cowsmeat',
        name: 'CowsMeat',
        component: CowsMeat,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/drinks',
        name: 'DrinksAndBar',
        component: DrinksAndBar,
        props: true,
        meta: { requiresAuth: true }
    },

    {
        path: '/:catchAll(.*)',
        name: 'NotFoundPage',
        component: NotFoundPage
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/register',
        name: "RegisterPage",
        component: RegisterPage
    },
    {
        path: '/aboutus',
        name: "AboutUs",
        component: AboutUs
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
