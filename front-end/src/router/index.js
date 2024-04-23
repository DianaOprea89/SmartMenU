import { createRouter, createWebHistory } from "vue-router";
import Profile from "@/views/Profile";
import NotFoundPage from "@/views/NotFound";
import LoginPage from "@/views/Login";
import RegisterPage from "@/views/Register";
import CallComponent from "@/views/Call";
import AboutUs from "@/views/AboutUs";
import Checkout from "@/views/Checkout";
import store from "@/store/store";
import AddRestaurants from "@/components/AddRestaurants";
import OptionMenu from "@/views/OptionMenu";
import MealOption from "@/components/MealOption";
import SubMenuOption from "@/components/SubMenuOption";
import AccessRestaurant from "@/components/AccessRestaurant";
import ViewRestaurantsMenu from "@/components/ViewRestaurantsMenu";


const routes = [
    {
        path: '/',
        redirect: '/menu',
    },
    {
        path: '/menu/:restaurantName',
        name: 'Profile',
        component: Profile,
        props: true,
        meta: { requiresAuth: true }
    }
    ,
    {
        path: '/menu',
        name: 'Profile',
        component: Profile,
        props: true,
        meta: { requiresAuth: true }
    },

    {
        path: '/restaurant/:restaurantName/accessRestaurant/viewMenu/checkout',
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
        path: '/restaurant/:restaurantName',
        name: 'OptionMenu',
        component: OptionMenu, // Lazy load the MainMenu component
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
        meta: { requiresAuth: true }
    },

    {
        path: '/restaurant/:restaurantName/:menuOption',
        name: "SubMenuOption",
        component: SubMenuOption,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/restaurant/:restaurantName/:menuOption/:subMenuOption/:mealOption',
        name: "MealOption",
        component: MealOption,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/restaurant/:restaurantName/accessRestaurant',
        name: "AccessRestaurant",
        component: AccessRestaurant,
        props: true,
    },
    {
        path: '/restaurant/:restaurantName/accessRestaurant/viewMenu',
        name: "ViewRestaurantsMenu",
        component: ViewRestaurantsMenu,
        props: true,
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