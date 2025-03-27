import { json,redirect  } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
//La cantida de imports que tiene esto es demencial aprenderme esto es poco viable.
import { createEmptyContact, getContacts } from "./data";
//usa la funcion getContacts de data.ts, no hace fata poner la extension?
import { useEffect } from "react";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};//Entiendo que loader es una palabra reservada? que significa el async? y el await?
//el json() supongo que hace un parse de info a json? porque esta entre {}?

import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
//porque este impor es type? esto nos permite usar las funciones de link detro del css y declara el tipo de links
import appStylesHref from "./app.css?url";
import { createRequestInit } from "@remix-run/react/dist/data";
//la funcion de link dentro del css autoestrae su url
// existing imports


export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};//esto se supone que detecta un metodo POST?? como sabe cual es el ${contact.id}



export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
]; // Esto es como si hicieramos: <link rel="stylesheet" href="./app.css" />
//se mete en <Links /> pero... poque esta en mayus la primera? no deberia ser en minuscula?


export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  //no tengo ni idea de que hace este const
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);
  //tampoco tengo ni idea de que hace useEffect

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
          <Form
              id="search-form"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
              role="search"
            >
              <input
                id="q"
                aria-label="Search contacts"
                className={navigation.state === "loading" && !searching ? "loading" : ""}
                defaultValue={q || ""}
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
          {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                      ? "pending"
                      : ""
                  }
                  to={`contacts/${contact.id}`}
                >
                    <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "/*que es esto?*/}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </Link>
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div           
            className={
              navigation.state === "loading" ? "loading" : ""
            } 
            id="detail">
            <Outlet />            
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
