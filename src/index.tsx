import {
  LocationProvider,
  Router,
  Route,
  hydrate,
  prerender as ssr,
} from "preact-iso"

import { Header } from "./components/Header.jsx"
import { NotFound } from "./pages/_404.jsx"
import { routes } from "./lib/routes.js"
import "./style.css"

export function App() {
  return (
    <LocationProvider>
      <Header />
      <main>
        <Router>
          {Object.keys(routes).map((route) => (
            <Route
              path={routes[route].path}
              component={routes[route].component}
            />
          ))}
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
  )
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"))
}

export async function prerender(data) {
  return await ssr(<App {...data} />)
}
