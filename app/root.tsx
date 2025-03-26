import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { getContacts } from "./data";
//usa la funcion getContacts de data.ts, no hace fata poner la extension?
export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
};//Entiendo que loader es una palabra reservada? que significa el async? y el await?
//el json() supongo que hace un parse de info a json? porque esta entre {}?

import type { LinksFunction } from "@remix-run/node";
//esto nos permite usar las funciones de link detro del css y declara el tipo de links
import appStylesHref from "./app.css?url";
//la funcion de link dentro del css autoestrae su url
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
]; // Esto es como si hicieramos: <link rel="stylesheet" href="./app.css" />
//se mete en <Links /> pero... poque esta en mayus la primera? no deberia ser en minuscula?


export default function App() {
  const { contacts } = useLoaderData<typeof loader>();
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
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
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
        <div id="detail">
            <Outlet />            
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
