import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Recipes from "./pages/Recipes.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import Chefs from "./pages/Chefs.jsx";
import ChefDetail from "./pages/ChefDetail.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.tsx";
import Profile from "./pages/Profile.jsx";
import PublishRecipe from "./pages/PublishRecipe.jsx";
import ChefProfile from "./pages/ChefProfile.jsx";
import NotFound from "./pages/NotFound.jsx";
import Cadastro from './pages/Register.jsx';
import "./styles/app.css";

function Router() {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/receitas" component={Recipes} />
          <Route path="/receita/:id" component={RecipeDetail} />
          <Route path="/chefes" component={Chefs} />
          <Route path="/chef/:id" component={ChefDetail} />
          <Route path="/quem-somos" component={About} />
          <Route path="/login" component={Login} />
          <Route path="/perfil" component={Profile} />
          <Route path="/publicar-receita" component={PublishRecipe} />
          <Route path="/perfil-chefe" component={ChefProfile} />
          <Route path="/404" component={NotFound} />
          <Route path="/cadastro" component={Cadastro}/>
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
