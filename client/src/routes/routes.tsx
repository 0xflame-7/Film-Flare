import { Switch, Route, Redirect } from "wouter";
import { Header } from "@/components/layout/header";
import useAuth from "@/hooks/use-auth";
import RegisterPage from "@/pages/registerPage";
import LoginPage from "@/pages/loginPage";
// import PerferencesPage from "@/pages/perferencesPage";
import HomePage from "@/pages/homePage";
import MoviePage from "@/pages/moviePage";

export default function Routes() {
  const auth = useAuth();

  return (
    <div className="w-screen h-screen overflow-hidden box-border flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 w-full h-full overflow-y-auto box-border">
        <Switch>
          {/* Auth routes */}
          <Route path="/auth/login">
            {auth?.isAuth ? <Redirect to="/" /> : <LoginPage />}
          </Route>
          <Route path="/auth/register">
            {auth?.isAuth ? <Redirect to="/" /> : <RegisterPage />}
          </Route>

          {/* Movie route */}
          <Route path="/movie">
            <MoviePage />
          </Route>

          {/* Home route */}
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </main>
    </div>
  );
}
