import { createRouter, createWebHistory } from "vue-router";
import Profile from "@/views/Profile";
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
import store from "@/store/store";
import AddRestaurants from "@/components/AddRestaurants";
import OptionMenu from "@/views/OptionMenu";

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
        name: 'Profile',
        component: Profile,
        props: true,
        meta: { requiresAuth: true }
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
        path: '/restaurant/:restaurantName',
        name: 'OptionMenu',
        component: OptionMenu, // Lazy load the MainMenu component
        props: true,
        meta: { requiresAuth: true }
    }
    ,
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
    },
    {
        path: '/addrestaurant',
        name: "AddRestaurants",
        component: AddRestaurants,
        meta: { requiresAuth: true } // only if authentication is required for this route
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});
router.beforeEach((to, from, next) => {

    if (to.meta.requiresAuth && !store.getters.isAuthenticated) {

        next('/login');
    } else if ((to.path === '/login' || to.path === '/register') && store.getters.isAuthenticated) {

        next('/menu');
    } else {
        next();
    }
});


export default router;
